import React from "react";
import {ActionType} from "../types";
import {Col, Form, Row} from "react-bootstrap";
import InlineFormControl from "./InlineFormControl";
import SectionError from "./SectionError";
import {useAppContext} from "../services/AppContextProvider";
import {usePlot} from "../hooks/usePlot";
import {CanvasPlot} from "./CanvasPlot";

export function Demography() {

    const {state, dispatch, rService} = useAppContext();
    const demography = state.demography

    const [plot, plotError] = usePlot(
        "demography", () => demography.numIndividuals > 0 && demography.tmax > 0,
        async () => {

            const demographyObj = await rService.getDemography(
                demography.numIndividuals,
                demography.tmax,
                demography.pRemoval);
            dispatch({
                type: ActionType.SET_DEMOGRAPHY,
                payload: {
                    rObj: demographyObj
                }
            })
            return await rService.getDemographyPlot(demographyObj);
        }, [dispatch, rService,
            demography.numIndividuals,
            demography.tmax,
            demography.pRemoval], 500)

    const setMaxTime = (tmax: number) => {
        dispatch({
            type: ActionType.SET_DEMOGRAPHY,
            payload: {tmax}
        })
    }

    const setN = (n: number) => {
        dispatch({
            type: ActionType.SET_DEMOGRAPHY,
            payload: {numIndividuals: n}
        })
    }

    const setP = (p: number) => {
        dispatch({
            type: ActionType.SET_DEMOGRAPHY,
            payload: {pRemoval: p}
        })
    }

    return <Row>
        <Col className={"pt-5"}>
            <h4>1. Define demography</h4>
            <SectionError error={plotError}/>
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
                    {(demography.numIndividuals > 0 && demography.tmax > 0) &&
                      <CanvasPlot plot={plot} title={"demography"} error={plotError}></CanvasPlot>}
                    {(!demography.numIndividuals || demography.numIndividuals < 1 || !demography.tmax || demography.tmax < 1) &&
                        <div className={"py-5 text-center"}>Choose a number of
                            individuals and max time greater than 0</div>}
                </Col>
            </Row>
        </Col>
    </Row>
}
