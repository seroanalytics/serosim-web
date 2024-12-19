import {
    Button,
    Col,
    Row, Table,
} from "react-bootstrap";
import React, {useContext} from "react";
import {ActionType, DispatchContext, StateContext} from "../contexts";
import {BiomarkerExposurePair} from "../types";
import AddBiomarkerExposureRow from "./AddBiomarkerExposureRow";

export function BiomarkersAndExposureTypes() {

    const state = useContext(StateContext);
    const dispatch = useContext(DispatchContext);

    const remove = (p: BiomarkerExposurePair) => {
        dispatch({
            type: ActionType.REMOVE_BIOMARKER_EXPOSURE_PAIR,
            payload: p
        })
    }

    return <Row><Col className={"pt-5"}>
        <h4>2. Define biomarkers and exposure types</h4>
        <Row className={"pt-3"}>
            <Col>
                <Table striped bordered>
                    <thead>
                    <tr>
                        <th>Exposure type</th>
                        <th>Biomarker</th>
                        <th>FOE</th>
                        <th></th>
                    </tr>
                    </thead>
                    <tbody>
                    {state.biomarkerExposurePairs.map(p => <tr
                        key={p.exposureType + p.biomarker}>
                        <td>{p.exposureType}</td>
                        <td>{p.biomarker}</td>
                        <td>{p.FOE}</td>
                        <td><Button variant={"close"} role={"close"}
                                    onClick={() => remove(p)}
                                    color={"red"}
                                    className={"mx-2"}></Button></td>
                    </tr>)}
                    <AddBiomarkerExposureRow></AddBiomarkerExposureRow>
                    </tbody>
                </Table>
            </Col>
        </Row>
    </Col>
    </Row>
}
