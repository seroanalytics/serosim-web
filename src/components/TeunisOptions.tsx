import React from "react";
import {Col, Row} from "react-bootstrap";
import InlineFormControl from "./InlineFormControl";
import {ActionType, Teunis} from "../types";
import {useAppContext} from "../services/AppContextProvider";

export default function TeunisOptions({exposureType}: { exposureType: string }) {
    const {state, dispatch} = useAppContext();
    const model = state.kinetics[exposureType].model as Teunis

    const setTPeak = (newValue: number) => {
        dispatch({
            type: ActionType.SET_KINETICS,
            payload: {
                exposureType: exposureType,
                model: {tPeak: newValue}
            }
        })
    }

    const setPeak = (newValue: number) => {
        dispatch({
            type: ActionType.SET_KINETICS,
            payload: {
                exposureType: exposureType,
                model: {peak: newValue}
            }
        })
    }

    const setK = (newValue: number) => {
        dispatch({
            type: ActionType.SET_KINETICS,
            payload: {
                exposureType: exposureType,
                model: {k: newValue}
            }
        })
    }

    const setV = (newValue: number) => {
        dispatch({
            type: ActionType.SET_KINETICS,
            payload: {
                exposureType: exposureType,
                model: {v: newValue}
            }
        })
    }


    const setR = (newValue: number) => {
        dispatch({
            type: ActionType.SET_KINETICS,
            payload: {
                exposureType: exposureType,
                model: {r: newValue}
            }
        })
    }

    return <Row>
            <Col>
                <InlineFormControl value={model.tPeak}
                                   handleChange={setTPeak}
                                   label={"Time at peak"}/>
                <InlineFormControl value={model.peak}
                                   handleChange={setPeak}
                                   label={"Peak"}/>

            </Col>
            <Col>
                <InlineFormControl value={model.k}
                                   handleChange={setK}
                                   label={"k"}/>
                <InlineFormControl value={model.v}
                                   handleChange={setV}
                                   label={"v"}/>
                <InlineFormControl value={model.r}
                                   handleChange={setR}
                                   label={"r"}/>
            </Col>
        </Row>
}
