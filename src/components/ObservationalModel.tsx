import React, {useContext, useState} from "react";
import {Col, Form, Row} from "react-bootstrap";
import InlineFormControl from "./InlineFormControl";
import {ActionType, DispatchContext, RContext, StateContext} from "../contexts";
import {ContinuousBounded, PlotlyProps} from "../types";
import {useDebouncedEffect} from "../hooks/useDebouncedEffect";
import {PlotlyPlot} from "./PlotlyPlot";
import SectionError from "./SectionError";
import {useR} from "../hooks/useR";

export default function ObservationalModel({biomarker}: { biomarker: string }) {
    const dispatch = useContext(DispatchContext);
    const state = useContext(StateContext);
    const obsModel = state.observationalModels[biomarker]!! as ContinuousBounded;
    const rService = useContext(RContext);
    const [plot, setPlot] = useState<PlotlyProps | null>(null);

    const setModelError = (newValue: number) => {
        dispatch({
            type: ActionType.SET_OBSERVATION_MODEL,
            payload: {
                biomarker: biomarker,
                model: {error: newValue}
            }
        })
    }

    const setLowerBound = (newValue: number) => {
        dispatch({
            type: ActionType.SET_OBSERVATION_MODEL,
            payload: {
                biomarker: biomarker,
                model: {lowerBound: newValue}
            }
        })
    }

    const setUpperBound = (newValue: number) => {
        dispatch({
            type: ActionType.SET_OBSERVATION_MODEL,
            payload: {
                biomarker: biomarker,
                model: {upperBound: newValue}
            }
        })
    }

    const setNumBleeds = (newValue: number) => {
        dispatch({
            type: ActionType.SET_OBSERVATION_MODEL,
            payload: {
                biomarker: biomarker,
                model: {numBleeds: newValue}
            }
        })
    }

    const plotError = useR(async () => {
        setPlot(null)
        const plot = await rService.getObs(obsModel, state.demography);
        setPlot(plot)
    }, [obsModel, state.demography])

    return <Row className={"mb-2"}>
        <div className={"pb-2"}><SectionError error={plotError}/></div>
        <Col sm={4}>
            <Form className={"pt-3 border px-2"}>
                <h5 className={"pb-2"}>{biomarker}</h5>
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
                                   handleChange={setNumBleeds}
                                   label={"Number of bleeds per person"}/>
            </Form>
        </Col>
        <Col>
            <PlotlyPlot plot={plot} error={plotError}/>
        </Col>
    </Row>
}
