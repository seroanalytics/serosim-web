import {Col, Row} from "react-bootstrap";
import React from "react";
import {ActionType} from "../types";
import SectionError from "./SectionError";
import {useAppContext} from "../services/AppContextProvider";
import KineticsModelOptions from "./KineticsModelOptions";
import InlineFormSelect from "./InlineFormSelect";
import {usePlot} from "../hooks/usePlot";
import {CanvasPlot} from "./CanvasPlot";

export function AntibodyKinetics() {
    const {state, rService, dispatch} = useAppContext();

    const [plot, plotError] = usePlot("getKineticsPlot",
        () => state.demography.numIndividuals > 0 && state.demography.tmax > 0 && state.exposureTypes.length > 0,
        async () => {
            return await rService.getKineticsPlot(state.kineticsFunction, state.exposureTypes, state.kinetics, state.demography.numIndividuals, state.demography.tmax);
        },
        [rService, state.exposureTypes, state.kinetics, state.demography.numIndividuals, state.demography.tmax, state.kineticsFunction],
        750
    )

    const setKineticFunction = (newValue: number) => {
        dispatch({
            type: ActionType.SET_KINETICS_FUNCTION,
            payload: newValue
        })
    }

    if (!state.steps[4].ready(state)) {
        return null
    }

    return <Row>
        <Col className={"pt-4"}>
            <h4>5. Define antibody kinetics</h4>
            <div className={"pb-2"}>
                <SectionError error={plotError}/>
            </div>
            <Row>
                <Col sm={6}>
                    <InlineFormSelect value={state.kineticsFunction}
                                      label={"Kinetic function"}
                                      handleChange={setKineticFunction}>
                        <option value={"monophasic"}>Monophasic decay</option>
                        <option value={"biphasic"}>Biphasic decay</option>
                    </InlineFormSelect>
                </Col>
            </Row>
            <Row>
                <Col>
                    {state.exposureTypes.map(e => <KineticsModelOptions
                        key={e.exposureType} exposureType={e.exposureType}/>)}
                </Col>
                <Col>
                    <CanvasPlot plot={plot} error={plotError} title={"antibody"}></CanvasPlot>
                </Col>
            </Row>
        </Col>
    </Row>
}
