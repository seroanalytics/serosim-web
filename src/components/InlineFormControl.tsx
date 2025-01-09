import {Col, Form, FormLabel} from "react-bootstrap";
import React from "react";

interface Props {
    value: number | string
    handleChange: (value: any) => void
    label: string
    type?: "float" | "int" | "string"
}

export default function InlineFormControl({value, handleChange, label, type = "float"}: Props) {

    const handleChangeEvent = (e: any) => {
       let value: any = e.target.value;
        if (type === "float") {
            value = parseFloat(e.target.value)
        } else if (type === "int") {
            value = parseInt(e.target.value)
        }
        handleChange(value);
    };

    return <Form.Group className="row g-3 mb-3 align-items-center">
        <Col className={"text-end"}>
            <FormLabel>
                {label}
            </FormLabel>
        </Col>
        <Col>
            <Form.Control type={type !== "string" ? "number": "text"} value={value}
                          onChange={handleChangeEvent}/>
        </Col>
    </Form.Group>
}
