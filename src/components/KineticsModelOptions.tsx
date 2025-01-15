import React, {Dispatch} from "react";
import {Col, Form, Row} from "react-bootstrap";
import InlineFormControl from "./InlineFormControl";
import {Action, ActionType, KineticsModel} from "../types";
import {useAppContext} from "../services/AppContextProvider";

export default function KineticsModelOptions({exposureType}: {
    exposureType: string
}) {
    const {state, dispatch} = useAppContext();
    const model = state.kinetics[exposureType];

    const setBoostLong = setParameter(dispatch, exposureType, "boostLong");
    const setBoostShort = setParameter(dispatch, exposureType, "boostShort");
    const setWaneLong = setParameter(dispatch, exposureType, "waneLong");
    const setWaneShort = setParameter(dispatch, exposureType, "waneShort");

    return <Form className={"pt-3 mt-2 border px-2"}>
        <h5 className={"pb-2"}>
            {exposureType}
        </h5><Row>
        <Col>
            <InlineFormControl value={model.boostLong}
                               handleChange={setBoostLong}
                               label={state.kineticsFunction === "biphasic" ? "Boost long": "Boost"}/>
            {state.kineticsFunction === "biphasic" &&
                <InlineFormControl value={model.boostShort}
                                   handleChange={setBoostShort}
                                   label={"Boost short"}/>}

        </Col>
        <Col>
            <InlineFormControl value={model.waneLong}
                               handleChange={setWaneLong}
                               label={state.kineticsFunction === "biphasic" ? "Wane long": "Wane"}/>
            {state.kineticsFunction === "biphasic" &&
                <InlineFormControl value={model.waneShort}
                                   handleChange={setWaneShort}
                                   label={"Wane short"}/>}
        </Col>
    </Row>
    </Form>
}

function setParameter(dispatch: Dispatch<Action>, exposureType: string, paramName: "boostLong" | "boostShort" | "waneLong" | "waneShort") {
    return (newValue: number) => {
        const model: Partial<KineticsModel> = {}
        model[paramName] = newValue
        dispatch({
            type: ActionType.SET_KINETICS,
            payload: {
                exposureType: exposureType,
                model: model
            }
        })
    }
}
