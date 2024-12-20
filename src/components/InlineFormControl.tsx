import {Col, Form, FormLabel} from "react-bootstrap";
import React from "react";

interface Props {
    value: number
    handleChange: (value: number) => void
    label: string
    type?: "float" | "int"
}

export default function InlineFormControl({value, handleChange, label, type = "int"}: Props) {

    const handleChangeEvent = (e: any) => {
       let value = 0;
        if (type === "float") {
            value = parseFloat(e.target.value)
        } else {
            value = parseInt(e.target.value)
        }
        handleChange(e.target.value);
    };

    return <Form.Group className="row g-3 mb-3 align-items-center">
        <Col className={"text-end"}>
            <FormLabel>
                {label}
            </FormLabel>
        </Col>
        <Col>
            <Form.Control type={"number"} value={value}
                          onChange={handleChangeEvent}/>
        </Col>
    </Form.Group>
}
