import {Button, Form} from "react-bootstrap";
import React, {useContext, useState} from "react";
import {ActionType, DispatchContext, StateContext} from "../contexts";

export default function AddBiomarkerExposureRow() {

    const dispatch = useContext(DispatchContext);
    const state = useContext(StateContext);

    const [biomarker, setBiomarker] = useState("")
    const [exposureType, setExposureType] = useState("")
    const [FOE, setFOE] = useState(0)
    const [valid, setValid] = useState<boolean>(true);
    const [validationMessage, setValidatioMessage] = useState<string>("");

    const add = () => {
        if (state.biomarkerExposurePairs.filter(p => p.biomarker === biomarker && p.exposureType === exposureType).length > 0) {
            setValid(false);
            setValidatioMessage("Biomarker and exposure type combination must be unique")
        } else if (!exposureType) {
            setValid(false);
            setValidatioMessage("Exposure type must not be null");
        } else if (!biomarker) {
            setValid(false);
            setValidatioMessage("Biomarker must not be null");
        } else {
            dispatch({
                type: ActionType.ADD_BIOMARKER_EXPOSURE_PAIR,
                payload: {
                    biomarker: biomarker,
                    exposureType: exposureType,
                    FOE: FOE
                }
            })
            setFOE(0)
            setBiomarker("")
            setExposureType("")
            setValidatioMessage("")
            setValid(true)
        }
    }

    const onChangeBiomarker = (e: any) => {
        setBiomarker(e.target.value);
        setValid(true);
    };
    const onChangeExposureType = (e: any) => {
        setExposureType(e.target.value);
        setValid(true);
    };
    const onChangeFOE = (e: any) => {
        setFOE(parseFloat(e.target.value));
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
            <Form.Control type={"text"}
                          name="biomarker"
                          value={biomarker} onChange={onChangeBiomarker}>
            </Form.Control>
        </td>

        <td>
            <Form.Control type={"number"}
                          name="FOE"
                          value={FOE} onChange={onChangeFOE}>
            </Form.Control>
        </td>

        <td>
            <div
                className={valid ? "d-none" : "invalid-feedback d-block"}>
                {validationMessage}
            </div>
            <Button variant="success"
                    onClick={add}>Add</Button>
        </td>

    </tr>
}
