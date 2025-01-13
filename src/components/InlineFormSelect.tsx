import {Col, Form, FormLabel} from "react-bootstrap";
import React, {ReactNode} from "react";

interface Props {
    value: number | string
    handleChange: (value: any) => void
    label: string
    children: ReactNode
}

export default function InlineFormSelect({value, handleChange, label, children}: Props) {

    const handleChangeEvent = (e: any) => {
        handleChange(e.target.value);
    };

    return <Form.Group className="row g-3 mb-3 align-items-center">
        <Col className={"text-end"}>
            <FormLabel>
                {label}
            </FormLabel>
        </Col>
        <Col>
            <Form.Select value={value}
                         onChange={handleChangeEvent}>{children}</Form.Select>
        </Col>
    </Form.Group>
}
