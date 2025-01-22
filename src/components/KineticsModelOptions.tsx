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

    const setBoost = setParameter(dispatch, exposureType, "boost");
    const setWane = setParameter(dispatch, exposureType, "wane");

    const setBoostShort = setParameter(dispatch, exposureType, "boostShort");
    const setWaneShort = setParameter(dispatch, exposureType, "waneShort");

    const isBiphasic = state.kineticsFunction === "biphasic";

    return <Form className={"pt-3 mb-2 border px-2"}>
        <h5 className={"pb-2"}>
            {exposureType}
        </h5><Row>
        <Col>
            <InlineFormControl value={model.boost}
                               handleChange={setBoost}
                               label={isBiphasic ? "Boost long": "Boost"}/>
            {isBiphasic &&
                <InlineFormControl value={model.boostShort}
                                   handleChange={setBoostShort}
                                   label={"Boost short"}/>}

        </Col>
        <Col>
            <InlineFormControl value={model.wane}
                               handleChange={setWane}
                               label={isBiphasic ? "Wane long": "Wane"}/>
            {isBiphasic &&
                <InlineFormControl value={model.waneShort}
                                   handleChange={setWaneShort}
                                   label={"Wane short"}/>}
        </Col>
    </Row>
    </Form>
}

function setParameter(dispatch: Dispatch<Action>, exposureType: string, paramName: "boost" | "boostShort" | "wane" | "waneShort") {
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
