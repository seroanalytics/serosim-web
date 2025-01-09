import {
    Button,
    Col,
    Row, Table,
} from "react-bootstrap";
import React, {useContext} from "react";
import {ActionType, DispatchContext, StateContext} from "../contexts";
import {ExposureType} from "../types";
import AddExposureRow from "./AddExposureRow";

export function ExposureTypes() {

    const state = useContext(StateContext);
    const dispatch = useContext(DispatchContext);

    const remove = (p: ExposureType) => {
        dispatch({
            type: ActionType.REMOVE_EXPOSURE_TYPE,
            payload: p
        })
    }

    return <Row>
        <Col className={"pt-5"}>
        <h4>4. Define exposures</h4>
        <Row className={"pt-3"}>
            <Col>
                <Table striped bordered>
                    <thead>
                    <tr>
                        <th>Exposure name</th>
                        <th>FOE</th>
                        <th>Is vaccination</th>
                        <th>Eligible age</th>
                        <th></th>
                    </tr>
                    </thead>
                    <tbody>
                    {state.exposureTypes.map(p => <tr
                        key={p.exposureType}>
                        <td>{p.exposureType}</td>
                        <td>{p.FOE}</td>
                        <td>{p.isVax ? "Yes" : "No"}</td>
                        <td>{p.age || "NA"}</td>
                        <td><Button variant={"close"} role={"close"}
                                    onClick={() => remove(p)}
                                    color={"red"}
                                    className={"mx-2"}></Button></td>
                    </tr>)}
                    <AddExposureRow></AddExposureRow>
                    </tbody>
                </Table>
            </Col>
        </Row>
    </Col>
    </Row>
}
