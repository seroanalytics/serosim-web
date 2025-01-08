import {Col, Row} from "react-bootstrap";
import React, {useContext} from "react";
import {StateContext} from "../contexts";
import BiphasicDecay from "./BiphasicDecay";

export function AntibodyKinetics() {
    const state = useContext(StateContext);
    if (!state.steps[2].ready(state)) {
        return null
    }

    return <Row><Col className={"pt-4"}>
        <h4>3. Define antibody kinetics</h4>
        <Row>
            {state.biomarkerExposurePairs.map(p => <BiphasicDecay key={p.exposureType+p.biomarker} pair={p}/>)}
        </Row>
    </Col>
    </Row>
}
