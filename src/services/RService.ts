import {REnvironment, WebR} from "webr";
import {
    AppState,
    ImmunityModel,
    PlotlyProps
} from "../types";
import {WebRDataJs} from "webr/dist/webR/robj";

export class RService {

    private _webR: WebR
    private _ready = false


    private async _generatePlot(plottingCode: string, env?: REnvironment) {
        await this.waitForReady();
        if (!env) {
            env = await new this._webR.REnvironment()
        }
        const plotlyData = await this._webR.evalRString(`
            p <- ${plottingCode}               
            plotly::plotly_json(p, pretty = FALSE)
        `, {env})
        await this._webR.globalShelter.purge()
        return JSON.parse(plotlyData)
    }

    constructor() {
        this._webR = new WebR();
        console.log("New R worker")
    }

    close() {
        this._webR.close()
    }

    async init() {
        console.log("Initialising R")
        await this._webR.init();
        await this._webR.installPackages(['plotly', 'ggplot2', 'viridis']);
        await this._webR.installPackages(['serosim'], {repos: ["http://127.0.0.1:9090/repo", "https://repo.r-wasm.org/"]});

        this._ready = true
    }

    async getDemography(N: number, maxTime: number, p: number) {
        await this.waitForReady();
        const result = await this._webR.evalR(`
          birth_times <- rep(1, ${N})
          demography <- serosim::generate_pop_demography(${N}, times = 1:${maxTime}, birth_times = birth_times, removal_min=1, removal_max=${maxTime}, prob_removal=${p})
          demography
          `)
        return await result.toJs()
    }

    async getDemographyPlot(demography: WebRDataJs): Promise<PlotlyProps> {
        await this.waitForReady();
        const env = await new this._webR.REnvironment({demography});
        return await this._generatePlot(`
               ggplot2::ggplot(as.data.frame(demography)) + 
                ggplot2::geom_segment(ggplot2::aes(y = i, yend = i, x = birth, xend = removal - 1), linewidth = 2, alpha = 0.2, color = "gray85") + 
                ggplot2::theme_minimal() + ggplot2::labs(x = "Time in study", y = "Individuals")  + 
                ggplot2::theme(axis.text.y = ggplot2::element_blank())`, env
        )
    }

    async getImmune(model: ImmunityModel) {
        await this.waitForReady();
        return await this._generatePlot(`
               serosim::plot_biomarker_mediated_protection(0:${model.max}, 
                        biomarker_prot_midpoint=${model.midpoint},
                        biomarker_prot_width=${model.variance})`
        )
    }

    async getObs(numBleeds: number, numIndividuals: number, tmax: number) {
        await this.waitForReady();
        const observationTimes = await this._webR.evalR(`
                   do.call(rbind, lapply(1:${numIndividuals}, function(i) {
                          data.frame(
                            id = i,
                            t = sample(1:${tmax}, ${numBleeds}),
                            b = 1
                          )
                    }))`
        )
        const env = await new this._webR.REnvironment({observation_times: observationTimes});
        return await this._generatePlot(`
            ggplot2::ggplot(observation_times) + 
                        ggplot2::geom_point(ggplot2::aes(y = id, x = t), color = "red")
            `, env)
    }

    async getIndividualKinetics(demography: WebRDataJs, result: WebRDataJs) {
        await this.waitForReady();
        const env = await new this._webR.REnvironment({demography, result});
        return await this._generatePlot(`
            serosim::plot_subset_individuals_history(as.data.frame(result$biomarker_states), 
                                                     as.data.frame(result$immune_histories_long), subset = 10, as.data.frame(demography))`, env);
    }

    async getImmuneHistories(result: WebRDataJs) {
        await this.waitForReady();
        const env = await new this._webR.REnvironment({result});
        return await this._generatePlot(
            "serosim::plot_immune_histories(as.data.frame(result$immune_histories_long))",
            env);
    }

    async getBiomarkerQuantity(result: WebRDataJs) {
        await this.waitForReady();
        const env = await new this._webR.REnvironment({result});
        return await this._generatePlot(
            "serosim::plot_biomarker_quantity(as.data.frame(result$biomarker_states))",
            env);
    }

    async getSeroDataJson(result: WebRDataJs) {
        await this.waitForReady();
        const env = await new this._webR.REnvironment({result});
        return await this._webR.evalRString("jsonlite::toJSON(result$observed_biomarker_states)", {env})
    }

    async getInfDataJson(result: WebRDataJs) {
        await this.waitForReady();
        const env = await new this._webR.REnvironment({result});
        return await this._webR.evalRString("jsonlite::toJSON(results$immune_histories_long)", {env})
    }

    async getResultsJson(result: WebRDataJs) {
        await this.waitForReady();
        const env = await new this._webR.REnvironment({result});
        return await this._webR.evalRString("jsonlite::toJSON(result)", {env})
    }

    async runSerosim(state: AppState) {
        await this.waitForReady();

        const modelParsKinetics = state.biomarkerExposurePairs.flatMap(p => [{
            exposure_id: p.exposureType,
            biomarker_id: p.biomarker,
            name: "boost_long",
            mean: state.kinetics[p.biomarker + p.exposureType].boostLong,
            sd: null,
            distribution: null
        },
            {
                exposure_id: p.exposureType,
                biomarker_id: p.biomarker,
                name: "boost_short",
                mean: state.kinetics[p.biomarker + p.exposureType].boostShort,
                sd: null,
                distribution: null
            },
            {
                exposure_id: p.exposureType,
                biomarker_id: p.biomarker,
                name: "wane_long",
                mean: state.kinetics[p.biomarker + p.exposureType].waneLong,
                sd: null,
                distribution: null
            },
            {
                exposure_id: p.exposureType,
                biomarker_id: p.biomarker,
                name: "wane_short",
                mean: state.kinetics[p.biomarker + p.exposureType].waneShort,
                sd: null,
                distribution: null
            }])

        const modelParsImmunity = state.biomarkerExposurePairs.flatMap(p => [{
            exposure_id: p.exposureType,
            biomarker_id: p.biomarker,
            name: "biomarker_prot_midpoint",
            mean: state.immunityModels[p.biomarker].midpoint,
            sd: null,
            distribution: null
        },
            {
                exposure_id: p.exposureType,
                biomarker_id: p.biomarker,
                name: "biomarker_prot_width",
                mean: state.immunityModels[p.biomarker].midpoint,
                sd: null,
                distribution: null
            }])

        const modelPars = [...modelParsKinetics, ...modelParsImmunity, {
            exposure_id: null,
            biomarker_id: 1,
            name: "obs_sd",
            mean: null,
            sd: 1,
            distribution: "normal"
        }]

        const obsBounds = Object.keys(state.observationalModels).flatMap(b => [{
            biomarker_id: b,
            name: "lower_bound",
            value: state.observationalModels[b].lowerBound
        },
            {
                biomarker_id: b,
                name: "upper_bound",
                value: state.observationalModels[b].upperBound
            }])

        const bounds = await new this._webR.RObject(obsBounds);
        const model_pars = await new this._webR.RObject(modelPars);
        const env = await new this._webR.REnvironment({
            demography: state.demography.rObj,
            model_pars,
            bounds
        });
        const N = state.demography.numIndividuals
        const tmax = state.demography.tmax
        const numBleeds = 1
        const result = await this._webR.evalR(`           
            simulation_settings <- list("t_start"=1,"t_end"=${tmax})
            
            observation_times <- do.call(rbind, lapply(1:${N}, function(i) {
                          data.frame(
                            id = i,
                            t = sample(1:${tmax}, ${numBleeds}),
                            b = 1
                          )
                    }))
                    
            biomarker_map_original <- data.frame(exposure_id = c("Delta", "Vax"), biomarker_id = c("IgG", "IgG"))
            biomarker_map <- serosim::reformat_biomarker_map(biomarker_map_original)
       
            foe_pars <- array(0, dim=c(1, ${tmax}, 2))

            ## Specify the force of exposure for exposure ID 1 which represents measles natural infection
            foe_pars[,,1] <- 0.02
    
            ## Specify the force of exposure for exposure ID 2 which represents measles vaccination
            foe_pars[,,2] <- 0.04
              
            serosim::runserosim(
                simulation_settings = simulation_settings,
                demography = as.data.frame(demography),
                observation_times = observation_times,
                foe_pars = foe_pars,
                biomarker_map = biomarker_map,
                model_pars = serosim::reformat_biomarker_map(model_pars),
                exposure_model = serosim::exposure_model_simple_FOE,
                immunity_model = serosim::immunity_model_vacc_ifxn_biomarker_prot,
                antibody_model = serosim::antibody_model_biphasic,
                observation_model = serosim::observation_model_continuous_noise,
                draw_parameters = serosim::draw_parameters_random_fx,
            
                ## Specify other arguments needed
                VERBOSE = 10,
                max_events = c(1, 1),
                vacc_exposures = 2,
                vacc_age = c(NA, 9),
                sensitivity = 1,
                specificity = 1
            )
        `, {env})
        await this._webR.destroy(result)
        return await result.toJs()
    }

    async waitForReady(): Promise<boolean> {
        return new Promise((resolve, reject) => {
            let myInterval = setInterval(() => {
                if (!this._ready) {
                    console.log('Waiting for R to be ready')
                } else {
                    clearInterval(myInterval);
                    resolve(true);
                }
            }, 1000)
        })
    }
}

