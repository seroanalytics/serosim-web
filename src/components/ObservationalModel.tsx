import React, {useContext, useState} from "react";
import {Col, Form, Row} from "react-bootstrap";
import InlineFormControl from "./InlineFormControl";
import {ActionType, DispatchContext, RContext, StateContext} from "../contexts";
import {ContinuousBounded, PlotlyProps} from "../types";
import {PlotlyPlot} from "./PlotlyPlot";
import SectionError from "./SectionError";
import {useAsyncEffectSafely} from "../hooks/useAsyncEffectSafely";

export default function ObservationalModel() {
    const dispatch = useContext(DispatchContext);
    const state = useContext(StateContext);
    const obsModel = state.observationalModel as ContinuousBounded;
    const rService = useContext(RContext);
    const [plot, setPlot] = useState<PlotlyProps | null>(null);

    const setModelError = (newValue: number) => {
        dispatch({
            type: ActionType.SET_OBSERVATION_MODEL,
            payload: {error: newValue}
        })
    }

    const setLowerBound = (newValue: number) => {
        dispatch({
            type: ActionType.SET_OBSERVATION_MODEL,
            payload: {lowerBound: newValue}
        })
    }

    const setUpperBound = (newValue: number) => {
        dispatch({
            type: ActionType.SET_OBSERVATION_MODEL,
            payload: {
                upperBound: newValue
            }
        })
    }

    const setNumBleeds = (newValue: number) => {
        dispatch({
            type: ActionType.SET_OBSERVATION_MODEL,
            payload: {
                numBleeds: newValue
            }
        })
    }

    const plotError = useAsyncEffectSafely(async () => {
        if (obsModel.numBleeds >= 1) {
            setPlot(null)
            const plot = await rService.getObservationTimesPlot(obsModel.numBleeds, state.demography.numIndividuals, state.demography.tmax);
            setPlot(plot)
        }
    }, [obsModel, state.demography.tmax, state.demography.numIndividuals, obsModel.numBleeds])

    return <Row>
        <Col className={"pt-5"}>
            <h4>2. Define observational model</h4>
            <Row className={"mb-2"}>
                <div className={"pb-2"}>
                    <SectionError error={plotError}/>
                </div>
                <Col>
                    <Form className={"pt-3 border px-2"}>
                        <InlineFormControl value={obsModel.error}
                                           handleChange={setModelError}
                                           label={"Error"}/>
                        <InlineFormControl value={obsModel.lowerBound}
                                           handleChange={setLowerBound}
                                           label={"Lower bound"}/>
                        <InlineFormControl value={obsModel.upperBound}
                                           handleChange={setUpperBound}
                                           label={"Upper bound"}/>
                        <InlineFormControl value={obsModel.numBleeds}
                                           type={"int"}
                                           handleChange={setNumBleeds}
                                           label={"Number of bleeds per person"}/>
                    </Form>
                </Col>
                <Col>
                    {obsModel.numBleeds >= 1 && <PlotlyPlot plot={plot} error={plotError}/>}
                    {obsModel.numBleeds < 1 && <div className={"py-5 text-center"}>Choose at least 1 bleed per person</div>}
                </Col>
            </Row>
        </Col>
    </Row>
}
