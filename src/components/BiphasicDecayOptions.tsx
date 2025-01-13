import React from "react";
import {Col, Row} from "react-bootstrap";
import InlineFormControl from "./InlineFormControl";
import {ActionType, BiphasicDecay} from "../types";
import {useAppContext} from "../services/AppContextProvider";

export default function BiphasicDecayOptions({exposureType}: {
    exposureType: string
}) {
    const {state, dispatch} = useAppContext();
    const model = state.kinetics[exposureType].model as BiphasicDecay

    const setBoostLong = (newValue: number) => {
        dispatch({
            type: ActionType.SET_KINETICS,
            payload: {
                exposureType: exposureType,
                model: {boostLong: newValue}
            }
        })
    }

    const setBoostShort = (newValue: number) => {
        dispatch({
            type: ActionType.SET_KINETICS,
            payload: {
                exposureType: exposureType,
                model: {boostShort: newValue}
            }
        })
    }

    const setWaneLong = (newValue: number) => {
        dispatch({
            type: ActionType.SET_KINETICS,
            payload: {
                exposureType: exposureType,
                model: {waneLong: newValue}
            }
        })
    }

    const setWaneShort = (newValue: number) => {
        dispatch({
            type: ActionType.SET_KINETICS,
            payload: {
                exposureType: exposureType,
                model: {waneShort: newValue}
            }
        })
    }

    return <Row>
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
}
