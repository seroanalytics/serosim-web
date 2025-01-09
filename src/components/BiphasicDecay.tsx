import React, {useContext} from "react";
import {Col, Form, Row} from "react-bootstrap";
import InlineFormControl from "./InlineFormControl";
import {ExposureType} from "../types";
import {ActionType, DispatchContext, StateContext} from "../contexts";

export default function BiphasicDecay({exposureType}: { exposureType: ExposureType }) {
    const dispatch = useContext(DispatchContext);
    const state = useContext(StateContext);
    const model = state.kinetics[exposureType.exposureType]

    const setBoostLong = (newValue: number) => {
        dispatch({
            type: ActionType.SET_KINETICS,
            payload: {
                exposure: exposureType,
                model: {boostLong: newValue}
            }
        })
    }

    const setBoostShort = (newValue: number) => {
        dispatch({
            type: ActionType.SET_KINETICS,
            payload: {
                exposure: exposureType,
                model: {boostShort: newValue}
            }
        })
    }

    const setWaneLong = (newValue: number) => {
        dispatch({
            type: ActionType.SET_KINETICS,
            payload: {
                exposure: exposureType,
                model: {waneLong: newValue}
            }
        })
    }

    const setWaneShort = (newValue: number) => {
        dispatch({
            type: ActionType.SET_KINETICS,
            payload: {
                exposure: exposureType,
                model: {waneShort: newValue}
            }
        })
    }

    return <Form className={"pt-3 mt-2 border px-2"}>
            <h5 className={"pb-2"}>
                {exposureType.exposureType}
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
}
