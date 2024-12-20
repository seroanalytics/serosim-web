import React, {useState, useContext} from "react";
import { DispatchContext, StateContext} from "../contexts";
import {PlotlyPlot} from "./PlotlyPlot";
import {Col, Form, Row} from "react-bootstrap";
import {useDebouncedEffect} from "../hooks/useDebouncedEffect";
import InlineFormControl from "./InlineFormControl";
import {generatePopDemography} from "../services/DemographyService";

export function DemographyJs() {

    const [N, setN] = useState<number>(100);
    const [maxTime, setMaxTime] = useState<number>(100);
    const [pRemoval, setpRemoval] = useState<number>(1);
    const [demography, setDemography] = useState<any>();
    const [plot, setPlot] = useState<any>(null);
    const dispatch = useContext(DispatchContext);
    const state = useContext(StateContext);

    useDebouncedEffect(() => {
        setDemography(null)
        const times = [...Array(parseInt(maxTime as any))].map((x, i) => i + 1)
        const birthTimes = new Array(parseInt(N as any)).fill(0)
        const demography = generatePopDemography(N,
            times,
            birthTimes, 0, 99, pRemoval)
        setDemography(demography)
    }, [N, pRemoval, maxTime], 250)

   useDebouncedEffect( () => {
        setPlot(null);
        if (demography) {
            const data = demography.map((d: any) => ({
                x: [d.birth, d.removal - 1], // Adjusted removal to match ggplot2's behavior
                y: [d.i, d.i],
                mode: 'lines',
                line: {width: 8, color: '#D3D3D3', opacity: 1},
                hoverinfo: 'text'
            }));

            console.log(data[1])
            const layout = {
                xaxis: {
                    title: 'Time in study',
                    showgrid: true,
                    gridcolor: "rgba(235,235,235,1)",
                    linecolor: "rgba(235,235,235,1)",
                    zeroline: true
                },
                yaxis: {
                    title: 'Individuals',
                    showgrid: true,
                    tickvals: [], // Removes tick labels on the y-axis
                    zeroline: false,
                    gridcolor: "rgba(235,235,235,1)",
                    linecolor: "rgba(235,235,235,1)"
                },
                showlegend: false,
                hovermode: "closest",
                template: 'simple_white' // Mimics a minimal theme
            };
            setPlot({data, layout});
        } else {
            setPlot(null);
        }

    }, [demography], 250)

    return <Row>
        <Col className={"pt-5"}>
            <h5>5. Define demography</h5>
            <Row className={"mt-3"}>
                <Col sm={4}>
                    <Form className={"pt-4 border px-2"}>
                        <InlineFormControl value={N} handleChange={setN}
                                           label={"Number of individuals"}/>
                        <InlineFormControl value={maxTime}
                                           handleChange={setMaxTime}
                                           label={"Max time"}/>
                        <InlineFormControl value={pRemoval}
                                           handleChange={setpRemoval}
                                           label={"Probability of removal"}/>
                    </Form>
                </Col>
                <Col>
                    <PlotlyPlot plot={plot} error={""}/>
                </Col>
            </Row>
        </Col>
    </Row>
}
