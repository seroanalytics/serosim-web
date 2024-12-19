import {RObject, WebR} from "webr";
import {AppState, PlotlyProps} from "../types";

export class RService {

    private _webR: WebR
    private _ready = false

    constructor() {
        this._webR = new WebR();
    }

    async init() {
        await this._webR.init();
        await this._webR.installPackages(['purrr']);
        await this._webR.installPackages(['serosim'], {repos: ["http://127.0.0.1:9090", "https://repo.r-wasm.org/"]});
        await this._webR.evalRVoid(`
                            library(serosim)
                         `
        )
        this._ready = true
    }

    async getDemography(N: number) {
        await this.waitForReady();
        const demography = await this._webR.evalR(`
          birth_times <- rep(1, ${N})
          generate_pop_demography(${N}, times = 1:100, birth_times = birth_times, removal_min=1, removal_max=100, prob_removal=1)
          `)

        let result = (await demography.toJs() as any)
        console.log(result)
        return demography
    }

    async getDemographyPlot(demography: RObject): Promise<PlotlyProps> {
        await this.waitForReady();
        const env = await new this._webR.REnvironment({demography});
        const plotlyData = await this._webR.evalR(`
         p <-  ggplot(demography) + 
                geom_segment(aes(y = i, yend = i, x = birth, xend = removal - 1), linewidth = 2, alpha = 0.2, color = "gray85") + 
                theme_minimal() + labs(x = "Time in study", y = "Individuals")  + 
                theme(axis.text.y = element_blank())
          
          plotly_json(p, pretty = FALSE)`, {env});
        let result = (await plotlyData.toJs() as any);
        console.log(result)
        return JSON.parse(result.values[0])
    }

    async convertObject() {
        await this.waitForReady();
        const test = [{
            max: 1,
            boostWane: 2,
            boostLong: 3
        }]
        let obj = await new this._webR.RObject(test);
        const env = await new this._webR.REnvironment({obj});
        await this._webR.evalRVoid(`
            str(obj)
        `, {env});
    }

    //
    // pars <- data.frame(
    //     exposure_id = rep(bioexp_i$exposure_id, 4),
    //     biomarker_id =  rep(bioexp_i$biomarker_id, 4),
    //     name = c("boost_long", "boost_short", "wane_long", "wane_short"),
    //     mean = c(input$boostLong, input$boost_short, input$wane_long, input$wane_short),
    //     sd = NA,
    //     distribution = NA
    // )
    // model_pars <- bind_rows(inputs[[1]]$pars, inputs[[2]]$pars)

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

        // const obsBounds = Object.keys(state.observationalModels).flatMap(b => [{
        //     biomarker_id: b,
        //     name: "lower_bound",
        //     value: state.observationalModels[b].lowerBound
        // },
        //     {
        //         biomarker_id: b,
        //         name: "upper_bound",
        //         value: state.observationalModels[b].upperBound
        //     }])

        const obsBounds = [{
            biomarker_id: 1,
            name: "lower_bound",
            value: 1
        },
            {
                biomarker_id: 1,
                name: "upper_bound",
                value: 100
            }]

        console.log(obsBounds)
        const bounds = await new this._webR.RObject(obsBounds);
        console.log(modelPars)
        const model_pars = await new this._webR.RObject(modelPars);
        const env = await new this._webR.REnvironment({
            demography: state.demography.rObj as RObject,
            model_pars,
            bounds
        });
        const N = state.demography.numIndividuals
        const tmax = state.demography.tmax
        const numBleeds = 1
        const result = await this._webR.evalR(`
             observation_times <- purrr::map_df(1:${N}, 
              function(i) {
                
                data.frame(
                  id = i, 
                  t = sample(1:${tmax}, ${numBleeds}),
                  b = 1
                )
              }
            )
           
            simulation_settings <- list("t_start"=1,"t_end"=${tmax})
            
         
            biomarker_map_original <- data.frame(exposure_id = c("Delta", "Vax"), biomarker_id = c("IgG", "IgG"))
            biomarker_map <- serosim::reformat_biomarker_map(biomarker_map_original)
       
            
            foe_pars <- array(0, dim=c(1, ${tmax}, 2))

            ## Specify the force of exposure for exposure ID 1 which represents measles natural infection
            foe_pars[,,1] <- 0.02
    
            ## Specify the force of exposure for exposure ID 2 which represents measles vaccination
            foe_pars[,,2] <- 0.04
            
 
            print(simulation_settings)
    print(demography)
   print(observation_times)
    print(foe_pars)
   print(biomarker_map)
  print(serosim::reformat_biomarker_map(model_pars))
    print(exposure_model_simple_FOE)
    print(serosim::immunity_model_vacc_ifxn_biomarker_prot)
    print(serosim::antibody_model_biphasic)
    print(serosim::observation_model_continuous_noise)
   print(serosim::draw_parameters_random_fx)
   
   serosim::runserosim(
    simulation_settings = simulation_settings,
    demography = demography,
    observation_times = observation_times,
    foe_pars = foe_pars,
    biomarker_map = biomarker_map,
    model_pars = serosim::reformat_biomarker_map(model_pars),
    exposure_model = exposure_model_simple_FOE,
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

