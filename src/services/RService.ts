import {REnvironment, WebR} from "webr";
import {
    AppState,
    KineticsModel,
    Dict,
    ExposureType,
    ImmunityModel, ObservationalModel,
    PlotlyProps
} from "../types";
import {WebRDataJs} from "webr/dist/webR/robj";

export interface RService {

    getKineticsPlot(kineticsFunction: "monophasic" | "biphasic", exposureTypes: ExposureType[], kinetics: Dict<KineticsModel>, numIndividuals: number, tmax: number): Promise<PlotlyProps>;

    getDemography(numIndividuals: number, tmax: number, pRemoval: number): Promise<WebRDataJs>;

    getDemographyPlot(demographyObj: WebRDataJs): Promise<PlotlyProps>;

    getImmunityPlot(max: number, midpoint: number, variance: number): Promise<PlotlyProps>;

    getObservationTimesPlot(numBleeds: number, numIndividuals: number, tmax: number): Promise<PlotlyProps>;

    getBiomarkerQuantity(result: WebRDataJs): Promise<PlotlyProps>;

    getIndividualKinetics(demography: WebRDataJs, result: WebRDataJs): Promise<PlotlyProps>;

    getResultsJson(result: WebRDataJs): Promise<string>;

    runSerosim(state: AppState): Promise<WebRDataJs>;

    getExposuresOutput(result: WebRDataJs): Promise<string>

    getSeroOutput(result: WebRDataJs): Promise<string>
}

export class WebRService implements RService {

    private _webR: WebR
    private _ready = false

    private async _generatePlot(plottingCode: string, env?: REnvironment): Promise<PlotlyProps> {
        await this.waitForReady();
        if (!env) {
            env = await new this._webR.REnvironment()
        }
        const plotlyData = await this._webR.evalRString(`
            p <- ${plottingCode}               
            plotly::plotly_json(p, pretty = FALSE)
        `, {env});
        return JSON.parse(plotlyData)
    }

    constructor() {
        this._webR = new WebR();
        console.log("New R worker")
    }

    close() {
        console.log("R worker closed");
        this._webR.close()
    }

    private getRepoUrl = () => {
        if (process.env.NODE_ENV === "development" || process.env.NODE_ENV === "test") {
            return "http://localhost:9090";
        }
        return `https://${window.location.host}/repo`;
    };

    async init() {
        console.log("Initialising R")
        await this._webR.init();
        await this._webR.installPackages(['plotly', 'ggplot2', 'viridis']);
        await this._webR.installPackages(['serosim'], {repos: [this.getRepoUrl(), "https://repo.r-wasm.org/"]});

        this._ready = true
    }

    async getDemography(N: number, maxTime: number, p: number): Promise<WebRDataJs> {
        await this.waitForReady();
        const result = await this._webR.evalR(`
          birth_times <- rep(1, ${N})
          demography <- serosim::generate_pop_demography(${N}, times = 1:${maxTime}, birth_times = birth_times, removal_min=1, removal_max=${maxTime}, prob_removal=${p})
          demography
          `)
        try {
            return await result.toJs()
        } finally {
            await this._webR.destroy(result);
        }
    }

    async getDemographyPlot(demography: WebRDataJs): Promise<PlotlyProps> {
        await this.waitForReady();
        const demographyRObj = await new this._webR.RObject(demography);
        try {
            const env = await new this._webR.REnvironment({demography: demographyRObj});
            return await this._generatePlot(`
               ggplot2::ggplot(as.data.frame(demography)) + 
                ggplot2::geom_segment(ggplot2::aes(y = i, yend = i, x = birth, xend = removal - 1), linewidth = 2, alpha = 0.2, color = "gray85") + 
                ggplot2::theme_minimal() + ggplot2::labs(x = "Time in study", y = "Individuals")  + 
                ggplot2::theme(axis.text.y = ggplot2::element_blank())`, env
            )
        } finally {
            await this._webR.destroy(demographyRObj)
        }
    }

    async getImmunityPlot(max: number, midpoint: number, variance: number) {
        await this.waitForReady();
        return await this._generatePlot(`
               serosim::plot_biomarker_mediated_protection(0:${max}, 
                        biomarker_prot_midpoint=${midpoint},
                        biomarker_prot_width=${variance})`
        )
    }

    async getObservationTimesPlot(numBleeds: number, numIndividuals: number, tmax: number) {
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
        try {
            const env = await new this._webR.REnvironment({observation_times: observationTimes});
            return await this._generatePlot(`
            ggplot2::ggplot(observation_times) + 
                        ggplot2::geom_point(ggplot2::aes(y = id, x = t), color = "red")
            `, env)
        } finally {
            await this._webR.destroy(observationTimes)
        }
    }

    async getIndividualKinetics(demography: WebRDataJs, result: WebRDataJs) {
        await this.waitForReady();
        const env = await new this._webR.REnvironment({demography, result});
        return await this._generatePlot(`
            serosim::plot_subset_individuals_history(as.data.frame(result$biomarker_states), 
                                                     as.data.frame(result$immune_histories_long), subset = 10, as.data.frame(demography))`, env);
    }

    async getImmuneHistories(result: WebRDataJs): Promise<PlotlyProps> {
        await this.waitForReady();
        const env = await new this._webR.REnvironment({result});
        return await this._generatePlot(
            "serosim::plot_immune_histories(as.data.frame(result$immune_histories_long))",
            env);
    }

    async getBiomarkerQuantity(result: WebRDataJs): Promise<PlotlyProps> {
        await this.waitForReady();
        const env = await new this._webR.REnvironment({result});
        return await this._generatePlot(
            "serosim::plot_biomarker_quantity(as.data.frame(result$biomarker_states))",
            env);
    }

    async getSeroOutput(result: WebRDataJs): Promise<string> {
        await this.waitForReady();
        const env = await new this._webR.REnvironment({result});
        return await this._webR.evalRString(`
            tc <- textConnection("csv", "w") 
            sero <- as.data.frame(result$observed_biomarker_states)[c("i", "t", "b", "observed")]
            write.table(sero, tc, row.names=F, col.names=c("id","day","biomarker","value"), sep=",")
            close(tc)
            paste0(csv, collapse="\n")
        `, {env})
    }

    async getExposuresOutput(result: WebRDataJs): Promise<string> {
        await this.waitForReady();
        const env = await new this._webR.REnvironment({result});
        return await this._webR.evalRString(`
            tc <- textConnection("csv", "w") 
            write.table(result$immune_histories_long, tc, row.names=F, col.names=c("id","day","exposure","value"), sep=",")
            close(tc)
            paste0(csv, collapse="\n")
        `, {env})
    }

    async getResultsJson(result: WebRDataJs): Promise<string> {
        await this.waitForReady();
        const env = await new this._webR.REnvironment({result});
        return await this._webR.evalRString("jsonlite::toJSON(result)", {env})
    }

    async getKineticsPlot(kineticsFunction: "monophasic" | "biphasic", exposureTypes: ExposureType[], kinetics: Dict<KineticsModel>, numIndividuals: number, tmax: number) {
        await this.waitForReady();
        const modelParsKinetics = await new this._webR.RObject(this.getKineticsModelPars(kineticsFunction, exposureTypes, kinetics));
        const biomarkerMap = await new this._webR.RObject(this.getBiomarkerMap(exposureTypes));
        const facetLabeller = await this.getFacetLabeler(exposureTypes);
        try {
            const env = await new this._webR.REnvironment({
                model_pars: modelParsKinetics,
                biomarker_map: biomarkerMap,
                facet_labeller: facetLabeller
            });
            return await this._generatePlot(
                `serosim::plot_antibody_model(serosim::antibody_model_${kineticsFunction}, N=${numIndividuals},times=seq(1,${tmax},by=1),
             model_pars=model_pars, draw_parameters_fn = serosim::draw_parameters_random_fx, biomarker_map=as.data.frame(biomarker_map)) +
             ggplot2::guides(color = "none") + ggplot2::facet_wrap(~exposure_id,scales="free_y", labeller = ggplot2::as_labeller(facet_labeller), ncol =1)
            `, env);
        } finally {
            await this._webR.destroy(facetLabeller)
            await this._webR.destroy(biomarkerMap)
            await this._webR.destroy(modelParsKinetics)
        }
    }

    async runSerosim(state: AppState): Promise<WebRDataJs> {
        await this.waitForReady();

        const modelParsKinetics = this.getKineticsModelPars(state.kineticsFunction, state.exposureTypes, state.kinetics);
        const modelParsImmunity = this.getImmunityModelPars(state.exposureTypes, state.immunityModel);
        const modelPars = [...modelParsKinetics, ...modelParsImmunity, {
            exposure_id: null,
            biomarker_id: 1,
            name: "obs_sd",
            mean: null,
            sd: state.observationalModel.error,
            distribution: "normal"
        }]
        const bounds = this.getObservationalBounds(state.observationalModel);

        const foe = state.exposureTypes.map(p => p.FOE);
        const N = state.demography.numIndividuals
        const tmax = state.demography.tmax
        const numBleeds = 1
        const numExp = foe.length;
        const biomarkerMap = this.getBiomarkerMap(state.exposureTypes);
        const vaccinations = state.exposureTypes.map((e, index) => e.isVax ? index + 1 : -1).filter(n => n > 0);
        const vaccExposures = vaccinations.length > 0 ? vaccinations : null;
        const vaccAges = state.exposureTypes.map(e => e.age || -1);

        const env = await new this._webR.REnvironment({
            demography: state.demography.rObj,
            biomarker_map: biomarkerMap,
            vacc_exposures: vaccExposures,
            vacc_ages: vaccAges,
            model_pars: modelPars,
            foe,
            bounded: state.observationalModel.type === "bounded",
            bounds
        });

        const result = await this._webR.evalR(`           
            simulation_settings <- list("t_start"=1,"t_end"=${tmax})
            observation_times <- do.call(rbind, lapply(1:${N}, function(i) {
                          data.frame(
                            id = i,
                            t = sample(1:${tmax}, ${numBleeds}),
                            b = 1
                          )
                    }))                                        
         
            foe_pars <- array(0, dim=c(1, ${tmax}, ${numExp}))
            
            for (i in seq_len(${numExp})) {
                foe_pars[,,i] <- foe[[i]]
            }
            
            obs_model <- ifelse(bounded, serosim::observation_model_continuous_bounded_noise, serosim::observation_model_continuous_noise)

            serosim::runserosim(
                simulation_settings = simulation_settings,
                demography = as.data.frame(demography),
                observation_times = observation_times,
                foe_pars = foe_pars,
                biomarker_map = as.data.frame(biomarker_map),
                model_pars = model_pars,
                exposure_model = serosim::exposure_model_simple_FOE,
                immunity_model = serosim::immunity_model_vacc_ifxn_biomarker_prot,
                antibody_model = serosim::antibody_model_${state.kineticsFunction},
                observation_model = obs_model,
                draw_parameters = serosim::draw_parameters_random_fx,
            
                ## Specify other arguments needed
                VERBOSE = 10,
                bounds = bounds,
                max_events = rep(1, ${numExp}),
                vacc_exposures = vacc_exposures,
                vacc_age = vacc_ages,
                sensitivity = 1,
                specificity = 1
            )
        `, {env})
        try {
            return await result.toJs();
        } finally {
            await this._webR.destroy(result);
        }
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

    private getBiomarkerMap(exposureTypes: ExposureType[]) {
        return exposureTypes.map((e, index) => ({
            exposure_id: index + 1,
            biomarker_id: 1
        }));
    }

    private getKineticsModelPars(kineticsFunction: "monophasic" | "biphasic",
                                 exposureTypes: ExposureType[],
                                 kinetics: Dict<KineticsModel>): any[] {

        if (kineticsFunction === "monophasic") {
            return exposureTypes.flatMap((e: ExposureType, index: number) => [
                {
                    exposure_id: index + 1,
                    biomarker_id: 1,
                    name: "boost",
                    mean: kinetics[e.exposureType].boost,
                    sd: null,
                    distribution: null
                },
                {
                    exposure_id: index + 1,
                    biomarker_id: 1,
                    name: "wane",
                    mean: kinetics[e.exposureType].wane,
                    sd: null,
                    distribution: null
                }
            ])
        } else {
            return exposureTypes.flatMap((e: ExposureType, index: number) => [
                {
                    exposure_id: index + 1,
                    biomarker_id: 1,
                    name: "boost_long",
                    mean: kinetics[e.exposureType].boost,
                    sd: null,
                    distribution: null
                },
                {
                    exposure_id: index + 1,
                    biomarker_id: 1,
                    name: "boost_short",
                    mean: kinetics[e.exposureType].boostShort,
                    sd: null,
                    distribution: null
                },
                {
                    exposure_id: index + 1,
                    biomarker_id: 1,
                    name: "wane_long",
                    mean: kinetics[e.exposureType].wane,
                    sd: null,
                    distribution: null
                },
                {
                    exposure_id: index + 1,
                    biomarker_id: 1,
                    name: "wane_short",
                    mean: kinetics[e.exposureType].waneShort,
                    sd: null,
                    distribution: null
                }])
        }
    }

    private getImmunityModelPars(exposureTypes: ExposureType[], immunityModel: ImmunityModel) {
        return exposureTypes.flatMap((e, index) => [{
            exposure_id: index + 1,
            biomarker_id: 1,
            name: "biomarker_prot_midpoint",
            mean: immunityModel?.midpoint,
            sd: null,
            distribution: null
        },
            {
                exposure_id: index + 1,
                biomarker_id: 1,
                name: "biomarker_prot_width",
                mean: immunityModel?.midpoint,
                sd: null,
                distribution: null
            }])
    }

    private getObservationalBounds(observationalModel: ObservationalModel) {
        return [
            {
                biomarker_id: 1,
                name: "lower_bound",
                value: observationalModel.lowerBound
            },
            {
                biomarker_id: 1,
                name: "upper_bound",
                value: observationalModel.upperBound
            }];
    }

    private async getFacetLabeler(exposureTypes: ExposureType[]) {
        const facetLabels = exposureTypes.map(e => e.exposureType);
        const facetLabelNames = exposureTypes.map((e, index) => `Exposure: ${index + 1}`);
        return await this._webR.evalR(`
            names(facet_labels) <- facet_label_names
            return(facet_labels)
        `, {
            env: {
                facet_labels: facetLabels,
                facet_label_names: facetLabelNames
            }
        })
    }
}
