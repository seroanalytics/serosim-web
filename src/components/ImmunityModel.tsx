import React, {useContext, useState} from "react";
import {Col, Form, Row} from "react-bootstrap";
import InlineFormControl from "./InlineFormControl";
import {ActionType, DispatchContext, RContext, StateContext} from "../contexts";
import {PlotlyPlot} from "./PlotlyPlot";
import {PlotlyProps} from "../types";
import SectionError from "./SectionError";
import {useAsyncEffectSafely} from "../hooks/useAsyncEffectSafely";

export default function ImmunityModel({biomarker}: { biomarker: string }) {

    const dispatch = useContext(DispatchContext);
    const state = useContext(StateContext);
    const rService = useContext(RContext);

    const immunityModel = state.immunityModels[biomarker]!!;
    const [plot, setPlot] = useState<PlotlyProps | null>(null);

    const setMax = (newValue: number) => {
        dispatch({
            type: ActionType.SET_IMMUNITY_MODEL,
            payload: {
                biomarker: biomarker,
                model: {max: newValue}
            }
        })
    }

    const setMidpoint = (newValue: number) => {
        dispatch({
            type: ActionType.SET_IMMUNITY_MODEL,
            payload: {
                biomarker: biomarker,
                model: {midpoint: newValue}
            }
        })
    }

    const setVariance = (newValue: number) => {
        dispatch({
            type: ActionType.SET_IMMUNITY_MODEL,
            payload: {
                biomarker: biomarker,
                model: {variance: newValue}
            }
        })
    }

    const plotError = useAsyncEffectSafely(async () => {
        setPlot(null)
        const plot = await rService.getImmune(immunityModel);
        setPlot(plot)
    }, [rService, immunityModel])


    return <Row className={"mb-2"}>
        <div className={"pb-2"}> <SectionError error={plotError}/></div>
        <Col sm={4}>
            <Form className={"pt-3 border px-2"}>
                <h5 className={"pb-2"}>{biomarker}</h5>
                <InlineFormControl value={immunityModel.max} type={"float"}
                                   handleChange={setMax}
                                   label={"Max biomarker value"}/>
                <InlineFormControl value={immunityModel.midpoint} type={"float"}
                                   handleChange={setMidpoint}
                                   label={"Midpoint of protection"}/>
                <InlineFormControl value={immunityModel.variance} type={"float"}
                                   handleChange={setVariance}
                                   label={"Variance"}/>
            </Form>
        </Col>
        <Col>
            <PlotlyPlot plot={plot} error={plotError}/>
        </Col>
    </Row>
}
