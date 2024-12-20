import React, {useState, useContext} from "react";
import {ActionType, DispatchContext, RContext, StateContext} from "../contexts";
import {PlotlyPlot} from "./PlotlyPlot";
import {Col, Form, Row} from "react-bootstrap";
import InlineFormControl from "./InlineFormControl";
import SectionError from "./SectionError";
import {useR} from "../hooks/useR";

export function Demography() {

    const [plot, setPlot] = useState<any>(null);
    const rService = useContext(RContext);
    const dispatch = useContext(DispatchContext);
    const state = useContext(StateContext);

    const demography = state.demography

    const demoError = useR(async () => {
        setPlot(null);

        if (demography.numIndividuals < 1) {
            throw Error("Number of individuals must be positive")
        } else {
            const demographyObj = await rService.getDemography(demography.numIndividuals);
            dispatch({
                type: ActionType.ADD_DEMOGRAPHY,
                payload: {
                    rObj: demographyObj
                }
            })
        }

    }, [dispatch, rService, demography.numIndividuals])

    const plotError = useR(async () => {
        console.log("plotting")
        console.log(demography.rObj)
        if (demography.rObj) {
            const result = await rService.getDemographyPlot(state.demography.rObj);
            setPlot(result);
        } else {
            setPlot(null);
        }

    }, [dispatch, rService, demography.rObj])

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
            <h4>5. Define demography</h4>
            <SectionError error={demoError}/>
            <SectionError error={plotError}/>
            <Row className={"mt-3"}>
                <Col sm={4}>
                    <Form className={"pt-4 border px-2"}>
                        <InlineFormControl value={demography.numIndividuals}
                                           handleChange={setN}
                                           label={"Number of individuals"}/>
                        <InlineFormControl value={demography.tmax}
                                           handleChange={setMaxTime}
                                           label={"Max time"}/>
                        <InlineFormControl value={demography.pRemoval}
                                           handleChange={setP}
                                           label={"Probability of removal"}/>
                    </Form>
                </Col>
                <Col>
                    <PlotlyPlot plot={plot} error={demoError || plotError}/>
                </Col>
            </Row>
        </Col>
    </Row>
}
