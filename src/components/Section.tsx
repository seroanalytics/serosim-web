import {Col, Row} from "react-bootstrap";
import React, {useState} from "react";
import SectionError from "./SectionError";

export default function Section() {

    const [error, setError] = useState<string>("")
    return <Row>
        <SectionError error={error} />
        <Col>

        </Col>
    </Row>
}
