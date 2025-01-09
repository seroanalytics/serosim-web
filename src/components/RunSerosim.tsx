import {Button, Col, Row} from "react-bootstrap";
import React, {useContext, useState} from "react";
import {ActionType, DispatchContext, RContext, StateContext} from "../contexts";
import {ScaleLoader} from "react-spinners";
import SectionError from "./SectionError";

export default function RunSerosim() {
    const dispatch = useContext(DispatchContext);
    const state = useContext(StateContext);
    const rService = useContext(RContext);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    async function runSerosim() {
        setLoading(true);
        setError("");
        dispatch({
            type: ActionType.SET_RESULTS,
            payload: null
        });
        try {
            const result = await rService.runSerosim(state)
            dispatch({
                type: ActionType.SET_RESULTS,
                payload: result
            });
        } catch (error) {
            setError(`${error}`);
        }
        setLoading(false);
    }

    return <Row className={"my-2"}>
        <Col>{loading && <ScaleLoader/>}
            <SectionError error={error}/>
            <Button variant={"primary"} size={"lg"}
                    disabled={!state.rReady || loading}
                    onClick={runSerosim}>
                Generate dataset
            </Button>
        </Col>
    </Row>
}
