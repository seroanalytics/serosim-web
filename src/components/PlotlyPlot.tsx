import React from "react";
import Plot from "react-plotly.js"
import {PlotlyProps} from "../types";

export function PlotlyPlot({plot}: {plot: PlotlyProps}) {
    return <Plot data={plot.data}
    layout={{
        ...plot.layout,
        margin: 0,
        autosize: true
    }}
    useResizeHandler={true}
    style={{
        minWidth: "400px",
        maxWidth: "1200px",
        width: "100%"
    }}/>
}
