import React from "react";
import Plot from "react-plotly.js"
import {PlotlyProps} from "../types";
import {ScaleLoader} from "react-spinners";
import {useAppContext} from "../services/AppContextProvider";

export function PlotlyPlot({plot, error, hasTitle}: {
    plot: PlotlyProps | null,
    error?: string | null,
    hasTitle?: boolean
}) {

    const {state} = useAppContext();

    let message = "Generating plot";
    if (!state.rReady) {
        message = "Waiting for R to be ready"
    }

    if (!plot) {
        return <div className={"py-5 text-center"}>
            {error ? "Plot could not be rendered" : <ScaleLoader/>}
            {!error && message}
        </div>
    } else {
        return <div className={"border p-2"}><Plot data={plot.data}
                                                   layout={{
                                                       ...plot.layout,
                                                       margin: {
                                                           b: plot.layout.margin.b,
                                                           l: plot.layout.margin.l,
                                                           r: plot.layout.margin.r,
                                                           t: hasTitle ? plot.layout.margin.t : 25
                                                       },
                                                       autosize: true
                                                   }}
                                                   style={{
                                                       minWidth: "400px",
                                                       maxWidth: "1200px",
                                                       width: "100%"
                                                   }}/></div>
    }
}
