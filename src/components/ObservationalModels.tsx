import {Col, Row} from "react-bootstrap";
import React, {useContext} from "react";
import {StateContext} from "../contexts";
import ObservationalModel from "./ObservationalModel";

export function ObservationalModels() {
    const state = useContext(StateContext);

    if (!state.steps[4].ready(state)) {
        return null
    }

    return <Row>
        <Col className={"pt-5"}>
            <h4>5. Define observational model</h4>
            {Array.from(new Set(state.biomarkerExposurePairs.map(p => p.biomarker))).map(b =>
                <ObservationalModel biomarker={b} key={b}/>)}
        </Col>
    </Row>
}
