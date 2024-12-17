import React from "react";
import Plot from "react-plotly.js"
import {PlotlyProps} from "../types";

export function PlotlyPlot({plot}: {plot: PlotlyProps}) {
    return <Plot data={plot.data}
    layout={{
        ...plot.layout,
        autosize: true
    }}
    useResizeHandler={true}
    style={{
        minWidth: "400px",
        width: "100%"
    }}/>
}
