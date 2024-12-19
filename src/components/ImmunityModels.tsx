import {Col, Row} from "react-bootstrap";
import React, {useContext} from "react";
import {StateContext} from "../contexts";
import ImmunityModel from "./ImmunityModel";

export function ImmunityModels() {
    const state = useContext(StateContext);

    return <Row>
        <Col className={"pt-5"}>
            <h4>5. Define immunity model</h4>
            {Array.from(new Set(state.biomarkerExposurePairs.map(p => p.biomarker))).map(b =>
                <ImmunityModel biomarker={b} key={b}/>)}
        </Col>
    </Row>
}
