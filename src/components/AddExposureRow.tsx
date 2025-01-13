import {Button, Form} from "react-bootstrap";
import React, {useState} from "react";
import {ActionType} from "../types";
import {useAppContext} from "../services/AppContextProvider";

export default function AddExposureRow() {

    const {state, dispatch} = useAppContext();

    const [exposureType, setExposureType] = useState("");
    const [FOE, setFOE] = useState(0);
    const [age, setAge] = useState(0);
    const [isVax, setIsVax] = useState(true);
    const [valid, setValid] = useState<boolean>(true);
    const [validationMessage, setValidatioMessage] = useState<string>("");

    const add = () => {
        if (state.exposureTypes.find(e => e.exposureType === exposureType)) {
            setValid(false);
            setValidatioMessage("Exposure types must be unique")
        } else if (!exposureType) {
            setValid(false);
            setValidatioMessage("Exposure type must not be null");
        } else {
            dispatch({
                type: ActionType.ADD_EXPOSURE_TYPE,
                payload: {
                    exposureType: exposureType,
                    FOE: FOE,
                    age: age,
                    isVax: isVax
                }
            })
            setFOE(0)
            setAge(0);
            setIsVax(false)
            setExposureType("")
            setValidatioMessage("")
            setValid(true)
        }
    }

    const onChangeExposureType = (e: any) => {
        setExposureType(e.target.value);
        setValid(true);
    };
    const onChangeFOE = (e: any) => {
        setFOE(parseFloat(e.target.value));
        setValid(true);
    };
    const onChangeVax = (e: any) => {
        setIsVax(e.target.value === "yes");
        setValid(true);
    };
    const onChangeAge = (e: any) => {
        setAge(e.target.value);
        setValid(true);
    };

    return <tr>
        <td>

            <Form.Control type={"text"}
                          name="exposure"
                          value={exposureType}
                          onChange={onChangeExposureType}>
            </Form.Control>

        </td>
        <td>
            <Form.Control type={"number"}
                          name="FOE"
                          value={FOE} onChange={onChangeFOE}>
            </Form.Control>
        </td>
        <td>
            <Form.Select
                name="isVax"
                value={isVax ? "yes" : "no"} onChange={onChangeVax}>
                <option value={"yes"}>Yes</option>
                <option value={"no"}>No</option>
            </Form.Select>
        </td>
        <td>
            {isVax && <Form.Control type={"number"}
                          name="age"
                          value={age} onChange={onChangeAge}>
            </Form.Control>}
        </td>

        <td>
            <div
                className={valid ? "d-none" : "invalid-feedback d-block"}>
                {validationMessage}
            </div>
            <Button variant="primary"
                    onClick={add}>Add</Button>
        </td>
    </tr>
}
