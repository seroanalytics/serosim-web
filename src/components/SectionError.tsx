import {Alert} from "react-bootstrap";
import React from "react";

interface Props {
    error: string
}

export default function SectionError({error}: Props) {
    if (!error) {
        return null
    }
    return <Alert variant={"danger"} className={"rounded-0 border-0 mb-1"}>
        {error}
    </Alert>
}
