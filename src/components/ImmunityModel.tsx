import React, {useContext, useState} from "react";
import {Col, Form, Row} from "react-bootstrap";
import InlineFormControl from "./InlineFormControl";
import {ActionType, DispatchContext, RContext, StateContext} from "../contexts";
import {PlotlyPlot} from "./PlotlyPlot";
import {PlotlyProps} from "../types";
import SectionError from "./SectionError";
import {useAsyncEffectSafely} from "../hooks/useAsyncEffectSafely";

export default function ImmunityModel() {

    const dispatch = useContext(DispatchContext);
    const state = useContext(StateContext);
    const rService = useContext(RContext);

    const immunityModel = state.immunityModel;
    const [plot, setPlot] = useState<PlotlyProps | null>(null);

    const setMax = (newValue: number) => {
        dispatch({
            type: ActionType.SET_IMMUNITY_MODEL,
            payload: {
                max: newValue
            }
        })
    }

    const setMidpoint = (newValue: number) => {
        dispatch({
            type: ActionType.SET_IMMUNITY_MODEL,
            payload: {
                midpoint: newValue
            }
        })
    }

    const setVariance = (newValue: number) => {
        dispatch({
            type: ActionType.SET_IMMUNITY_MODEL,
            payload: {
                variance: newValue
            }
        })
    }

    const setBiomarker = (newValue: string) => {
        dispatch({
            type: ActionType.SET_BIOMARKER,
            payload: newValue
        })
    }

    const plotError = useAsyncEffectSafely(async () => {
        setPlot(null)
        const plot = await rService.getImmunityPlot(immunityModel.max, immunityModel.midpoint, immunityModel.variance);
        setPlot(plot)
    }, [rService, immunityModel.max, immunityModel.variance, immunityModel.midpoint])


    return <Row className={"mb-2"}>
        <Col className={"pt-5"}>
            <h4>3. Define immunity model</h4>
            <Row className={"mt-3"}>
                <div className={"pb-2"}>
                    <SectionError error={plotError}/>
                </div>
                <Col>
                    <Form className={"pt-3 border px-2"}>
                        <InlineFormControl value={state.biomarker}
                                           type={"string"}
                                           handleChange={setBiomarker}
                                           label={"Biomarker name"}/>
                        <InlineFormControl value={immunityModel.max}
                                           type={"float"}
                                           handleChange={setMax}
                                           label={"Max biomarker value"}/>
                        <InlineFormControl value={immunityModel.midpoint}
                                           type={"float"}
                                           handleChange={setMidpoint}
                                           label={"Midpoint of protection"}/>
                        <InlineFormControl value={immunityModel.variance}
                                           type={"float"}
                                           handleChange={setVariance}
                                           label={"Variance"}/>
                    </Form>
                </Col>
                <Col>
                    {(immunityModel.max > 0 && immunityModel.midpoint > 0) &&
                        <PlotlyPlot plot={plot} error={plotError}/>}
                    {(immunityModel.max < 1 || immunityModel.midpoint < 1) &&
                        <div className={"py-5 text-center"}>Choose a valid max and midpoint</div>}
                </Col>
            </Row>
        </Col>
    </Row>
}
