import React, {useContext} from "react";
import {Col, Form, Row} from "react-bootstrap";
import InlineFormControl from "./InlineFormControl";
import {ActionType, DispatchContext, StateContext} from "../contexts";
import {ContinuousBounded} from "../types";

export default function ObservationalModel({biomarker}: { biomarker: string }) {
    const dispatch = useContext(DispatchContext);
    const state = useContext(StateContext);
    const obsModel = state.observationalModels[biomarker]!! as ContinuousBounded;

    const setError = (newValue: number) => {
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

    return <Row className = {"mb-2"}>
        <Col sm={4}>
            <Form className={"pt-3 border px-2"}>
                <h5 className={"pb-2"}>{biomarker}</h5>
                <InlineFormControl value={obsModel.error} handleChange={setError}
                                   label={"Error"}/>
                <InlineFormControl value={obsModel.lowerBound} handleChange={setLowerBound}
                                   label={"Lower bound"}/>
                <InlineFormControl value={obsModel.upperBound} handleChange={setUpperBound}
                                   label={"Upper bound"}/>
                <InlineFormControl value={obsModel.numBleeds} handleChange={setNumBleeds}
                                   label={"Number of bleeds per person"}/>
            </Form>
        </Col>
        <Col>
            
        </Col>
    </Row>
}
