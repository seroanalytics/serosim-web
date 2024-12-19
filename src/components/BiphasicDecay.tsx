import React, {useContext, useState} from "react";
import {Col, Form, Row} from "react-bootstrap";
import InlineFormControl from "./InlineFormControl";
import {BiomarkerExposurePair} from "../types";
import {ActionType, DispatchContext, StateContext} from "../contexts";

export default function BiphasicDecay({pair}: { pair: BiomarkerExposurePair }) {
    const dispatch = useContext(DispatchContext);
    const state = useContext(StateContext);
    const model = state.kinetics[pair.biomarker+pair.exposureType]

    const setBoostLong = (newValue: number) => {
        dispatch({
            type: ActionType.SET_KINETICS,
            payload: {
                pair: pair,
                model: {boostLong: newValue}
            }
        })
    }

    const setBoostShort = (newValue: number) => {
        dispatch({
            type: ActionType.SET_KINETICS,
            payload: {
                pair: pair,
                model: {boostShort: newValue}
            }
        })
    }

    const setWaneLong = (newValue: number) => {
        dispatch({
            type: ActionType.SET_KINETICS,
            payload: {
                pair: pair,
                model: {waneLong: newValue}
            }
        })
    }

    const setWaneShort = (newValue: number) => {
        dispatch({
            type: ActionType.SET_KINETICS,
            payload: {
                pair: pair,
                model: {waneShort: newValue}
            }
        })
    }

    return <Col sm={6} md={4} className={"pt-3"}>
        <Form className={"pt-3 border px-2"}>
            <h5 className={"pb-2"}>
                {pair.exposureType} / {pair.biomarker}
            </h5>
            <Row>
                <Col>
                    <InlineFormControl value={model.boostLong}
                                       handleChange={setBoostLong}
                                       label={"Boost long"}/>
                    <InlineFormControl value={model.boostShort}
                                       handleChange={setBoostShort}
                                       label={"Boost short"}/>

                </Col>
                <Col>
                    <InlineFormControl value={model.waneLong}
                                       handleChange={setWaneLong}
                                       label={"Wane long"}/>
                    <InlineFormControl value={model.waneShort}
                                       handleChange={setWaneShort}
                                       label={"Wane short"}/>
                </Col>
            </Row>
        </Form>
    </Col>
}
