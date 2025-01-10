import {Button} from "react-bootstrap";
import React from "react";
import {ActionType} from "../types";
import {useAppContext} from "../services/AppContextProvider";

export default function LoadScenarios() {

    const {dispatch} = useAppContext();

    const loadMeasles = () => {
        dispatch({
            type: ActionType.LOAD_SCENARIO,
            payload: "measles"
        })
    }

    const reset = () => {
        dispatch({
            type: ActionType.LOAD_SCENARIO,
            payload: "empty"
        })
    }
    return <div><p>Preconfigured scenarios:</p>
        <Button className={"me-2"} variant={"primary"}
                onClick={loadMeasles}>Measles</Button>
        <Button onClick={reset} variant={"secondary"}>Reset all
            fields</Button>
    </div>
}
