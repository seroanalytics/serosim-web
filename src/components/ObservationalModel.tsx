import React from "react";
import {Col, Form, Row} from "react-bootstrap";
import InlineFormControl from "./InlineFormControl";
import {ActionType} from "../types";
import SectionError from "./SectionError";
import InlineFormSelect from "./InlineFormSelect";
import {useAppContext} from "../services/AppContextProvider";
import {usePlot} from "../hooks/usePlot";
import {CanvasPlot} from "./CanvasPlot";

export default function ObservationalModel() {
    const {state, dispatch, rService} = useAppContext();
    const obsModel = state.observationalModel;

    const setModelError = (newValue: number) => {
        dispatch({
            type: ActionType.SET_OBSERVATION_MODEL,
            payload: {error: newValue}
        })
    }

    const setLowerBound = (newValue: number) => {
        dispatch({
            type: ActionType.SET_OBSERVATION_MODEL,
            payload: {lowerBound: newValue}
        })
    }

    const setUpperBound = (newValue: number) => {
        dispatch({
            type: ActionType.SET_OBSERVATION_MODEL,
            payload: {
                upperBound: newValue
            }
        })
    }

    const setNumBleeds = (newValue: number) => {
        dispatch({
            type: ActionType.SET_OBSERVATION_MODEL,
            payload: {
                numBleeds: newValue
            }
        })
    }

    const setType = (newValue: string) => {
        dispatch({
            type: ActionType.SET_OBSERVATION_MODEL,
            payload: {
                type: newValue
            }
        })
    }

    const [plot, plotError] = usePlot("obs_model",
        () => state.demography.tmax > 0 && state.demography.numIndividuals > 0 && obsModel.numBleeds > 0,
        async () => await rService.getObservationTimesPlot(obsModel.numBleeds, state.demography.numIndividuals, state.demography.tmax),
        [state.demography.tmax, state.demography.numIndividuals, obsModel.numBleeds],
        500)

    return <Row>
        <Col className={"pt-5"}>
            <h4>2. Define observational model</h4>
            <Row className={"mb-2"}>
                <div className={"pb-2"}>
                    <SectionError error={plotError}/>
                </div>
                <Col>
                    <Form className={"pt-3 border px-2"}>
                        <InlineFormControl value={obsModel.error}
                                           handleChange={setModelError}
                                           label={"Error"}/>
                        <InlineFormControl value={obsModel.numBleeds}
                                           type={"int"}
                                           handleChange={setNumBleeds}
                                           label={"Number of bleeds per person"}/>
                        <InlineFormSelect value={obsModel.type}
                                          handleChange={setType}
                                          label={"Observation function"}>
                            <option value={"unbounded"}>
                                Continuous-unbounded
                            </option>
                            <option value={"bounded"}>
                                Continuous-bounded
                            </option>
                        </InlineFormSelect>
                        {obsModel.type === "bounded" &&
                            <InlineFormControl value={obsModel.lowerBound}
                                               handleChange={setLowerBound}
                                               label={"Lower bound"}/>}
                        {obsModel.type === "bounded" &&
                            <InlineFormControl value={obsModel.upperBound}
                                               handleChange={setUpperBound}
                                               label={"Upper bound"}/>
                        }
                    </Form>
                </Col>
                <Col>
                    {obsModel.numBleeds >= 1 && state.demography.tmax > 0 && state.demography.numIndividuals > 0 &&
                        <CanvasPlot plot={plot} error={plotError} title={"obs"}/>}
                    {obsModel.numBleeds < 1 &&
                        <div className={"py-5 text-center"}>Choose at least 1
                            bleed per person</div>}
                    {(obsModel.numBleeds > 0 && !(state.demography.tmax > 0 && state.demography.numIndividuals > 0)) &&
                        <div className={"py-5 text-center"}>Choose a number of
                    individuals and max time greater than 0</div>}
                </Col>
            </Row>
        </Col>
    </Row>
}
