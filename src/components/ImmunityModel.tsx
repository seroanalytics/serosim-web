import React from "react";
import {Col, Form, Row} from "react-bootstrap";
import InlineFormControl from "./InlineFormControl";
import {ActionType} from "../types";
import SectionError from "./SectionError";
import {useAppContext} from "../services/AppContextProvider";
import {usePlot} from "../hooks/usePlot";
import {CanvasPlot} from "./CanvasPlot";

export default function ImmunityModel() {

    const {state, dispatch, rService} = useAppContext();
    const immunityModel = state.immunityModel;

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

    const [plot, plotError] = usePlot("immunity",
        () => immunityModel.max > 0 && immunityModel.midpoint > 0,
        async () => await rService.getImmunityPlot(immunityModel.max, immunityModel.midpoint, immunityModel.variance),
        [rService, immunityModel.max, immunityModel.variance, immunityModel.midpoint], 500)


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
                        <CanvasPlot plot={plot} error={plotError} title={"immunity"}/>}
                    {(immunityModel.max < 1 || immunityModel.midpoint < 1) &&
                        <div className={"py-5 text-center"}>Choose a valid max
                            and midpoint</div>}
                </Col>
            </Row>
        </Col>
    </Row>
}
