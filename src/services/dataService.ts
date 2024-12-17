import {WebR} from "webr";

export class DataService {

    private _webR: WebR
    private _ready = false

    constructor() {
        this._webR = new WebR();
    }

    async init() {
        await this._webR.init();
        await this._webR.installPackages(['ggplot2', 'plotly']);
        await this._webR.installPackages(['serosim'], {repos: ["http://127.0.0.1:9090", "https://repo.r-wasm.org/"]});
        await this._webR.evalRVoid(`
                            library(serosim)
                            library(plotly)
                            library(ggplot2)`
        )
        this._ready = true
    }

    async getDemography(N: number): Promise<PlotlyProps> {
        const plotlyData = await this._webR.evalR(`
          birth_times <- rep(1, ${N})
          demography <- generate_pop_demography(${N}, times = 1:100, birth_times = birth_times, removal_min=1, removal_max=100, prob_removal=1)
          p <-  ggplot(demography) + 
                geom_segment(aes(y = i, yend = i, x = birth, xend = removal - 1), linewidth = 2, alpha = 0.2, color = "gray85") + 
                theme_minimal() + labs(x = "Time in study", y = "Individuals", title = "Individuals in study over time")  + 
                theme(axis.text.y = element_blank())
          
          plotly_json(p, pretty = FALSE)
          `)

        let result = (await plotlyData.toJs() as any)
        return JSON.parse(result.values[0]);
    }
}
