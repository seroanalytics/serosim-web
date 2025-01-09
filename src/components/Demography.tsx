import React, {useState, useContext} from "react";
import {ActionType, DispatchContext, RContext, StateContext} from "../contexts";
import {PlotlyPlot} from "./PlotlyPlot";
import {Col, Form, Row} from "react-bootstrap";
import InlineFormControl from "./InlineFormControl";
import SectionError from "./SectionError";
import {useAsyncEffectSafely} from "../hooks/useAsyncEffectSafely";

export function Demography() {

    const [plot, setPlot] = useState<any>(null);

    const rService = useContext(RContext);
    const dispatch = useContext(DispatchContext);
    const state = useContext(StateContext);

    const demography = state.demography

    const demoError = useAsyncEffectSafely(async () => {
        if (demography.numIndividuals > 0 && demography.tmax > 0) {
            setPlot(null);
            const demographyObj = await rService.getDemography(
                demography.numIndividuals,
                demography.tmax,
                demography.pRemoval);
            dispatch({
                type: ActionType.ADD_DEMOGRAPHY,
                payload: {
                    rObj: demographyObj
                }
            })
            const result = await rService.getDemographyPlot(demographyObj);
            setPlot(result);
        }

    }, [dispatch, rService,
        demography.numIndividuals,
        demography.tmax,
        demography.pRemoval,
        demography.requireRecalculation])

    const setMaxTime = (tmax: number) => {
        dispatch({
            type: ActionType.ADD_DEMOGRAPHY,
            payload: {tmax}
        })
    }

    const setN = (n: number) => {
        dispatch({
            type: ActionType.ADD_DEMOGRAPHY,
            payload: {numIndividuals: n}
        })
    }

    const setP = (p: number) => {
        dispatch({
            type: ActionType.ADD_DEMOGRAPHY,
            payload: {pRemoval: p}
        })
    }

    return <Row>
        <Col className={"pt-5"}>
            <h4>1. Define demography</h4>
            <SectionError error={demoError}/>
            <Row className={"mt-3"}>
                <Col>
                    <Form className={"pt-4 border px-2"}>
                        <InlineFormControl value={demography.numIndividuals}
                                           type={"int"}
                                           handleChange={setN}
                                           label={"Number of individuals"}/>
                        <InlineFormControl value={demography.tmax}
                                           type={"int"}
                                           handleChange={setMaxTime}
                                           label={"Max time"}/>
                        <InlineFormControl value={demography.pRemoval}
                                           handleChange={setP}
                                           label={"Probability of removal"}/>
                    </Form>
                </Col>
                <Col>
                    {(demography.numIndividuals >0 && demography.tmax > 0) && <PlotlyPlot plot={plot}
                                error={demoError}/>}
                    {(demography.numIndividuals < 1 || demography.tmax < 1) &&
                        <div className={"py-5 text-center"}>Choose a number of
                            individuals and max time greater than 0</div>}
                </Col>
            </Row>
        </Col>
    </Row>
}
