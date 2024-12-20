import {Button, Col, Row} from "react-bootstrap";
import React, {useContext, useState} from "react";
import {ActionType, DispatchContext, RContext, StateContext} from "../contexts";
import {ScaleLoader} from "react-spinners";

export default function RunSerosim() {
    const dispatch = useContext(DispatchContext);
    const state = useContext(StateContext);
    const rService = useContext(RContext);

    const [loading, setLoading] = useState(false);

    async function runSerosim() {
        setLoading(true);
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
            console.log(error)
            dispatch({
                type: ActionType.ERROR_ADDED,
                payload: "Error executing R code: " + error
            })
        }
        setLoading(false);
    }

    return <Row className={"mt-5 text-center"}>
        <Col>{loading && <ScaleLoader/>}
            <Button variant={"success"} size={"lg"}
                    disabled={!state.rReady || loading}
                    onClick={runSerosim}>
                Generate dataset
            </Button>

        </Col>
    </Row>
}
