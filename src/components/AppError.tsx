import {Alert, Button} from "react-bootstrap";
import React, {useContext} from "react";
import {ActionType, DispatchContext} from "../contexts";

interface Props {
    error: string
}

export default function AppError({error}: Props) {
    const dispatch = useContext(DispatchContext);
    const remove = () => {
        dispatch({type: ActionType.ERROR_DISMISSED, payload: error});
    }
    return <Alert variant={"danger"} className={"rounded-0 border-0 mb-1"}>
        {error}
        <Button variant={"close"} role={"close"} onClick={remove}
                className={"mx-2 float-end"}></Button>
    </Alert>
}
