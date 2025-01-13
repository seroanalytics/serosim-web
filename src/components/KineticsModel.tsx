import React from "react";
import {ActionType} from "../types";
import {useAppContext} from "../services/AppContextProvider";
import BiphasicDecayOptions from "./BiphasicDecayOptions";
import TeunisOptions from "./TeunisOptions";
import {Col, Form, Row} from "react-bootstrap";
import InlineFormSelect from "./InlineFormSelect";

export default function KineticsModel({exposureType}: {
    exposureType: string
}) {
    const {state, dispatch} = useAppContext();

    const setType = (newValue: number) => {
        dispatch({
            type: ActionType.SET_KINETICS_TYPE,
            payload: {
                exposureType: exposureType,
                type: newValue
            }
        })
    }

    const model = state.kinetics[exposureType]
    return <Form className={"pt-3 mt-2 border px-2"}>
        <h5>
            {exposureType}
        </h5>
        <Row>
            <Col sm={12}>
                <InlineFormSelect value={model.type}
                                  label={"Kinetic function"}
                                  handleChange={setType}>
                    <option value={"biphasic"}>Biphasic decay</option>
                    <option value={"teunis"}>Teunis 2016</option>
                </InlineFormSelect>
            </Col>
        </Row>
        {model.type === "biphasic" &&
            <BiphasicDecayOptions exposureType={exposureType}/>}
        {model.type === "teunis" &&
            <TeunisOptions exposureType={exposureType}/>}
    </Form>
}
