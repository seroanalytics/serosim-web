import React from "react";
import Plot from "react-plotly.js"
import {PlotlyProps} from "../types";
import {ScaleLoader} from "react-spinners";

export function PlotlyPlot({plot, error}: {
    plot: PlotlyProps | null,
    error?: string | null
}) {

    if (!plot) {
        return <div className={"py-5 text-center"}>
            {error ? "Plot could not be rendered" : <ScaleLoader/>}
        </div>
    } else {
        return <div className={"border p-2"}><Plot data={plot.data}
                                               layout={{
                                                   ...plot.layout,
                                                   margin: {
                                                       b: plot.layout.margin.b,
                                                       l: plot.layout.margin.l,
                                                       r: plot.layout.margin.r,
                                                       t: 25
                                                   },
                                                   autosize: true
                                               }}
            // useResizeHandler={true}
                                               style={{
                                                   minWidth: "400px",
                                                   maxWidth: "1200px",
                                                   width: "100%"
                                               }}/></div>
    }
}
