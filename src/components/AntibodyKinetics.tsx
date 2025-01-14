import {Col, Row} from "react-bootstrap";
import React, {useState} from "react";
import {PlotlyPlot} from "./PlotlyPlot";
import {useAsyncEffectSafely} from "../hooks/useAsyncEffectSafely";
import {ActionType, PlotlyProps} from "../types";
import SectionError from "./SectionError";
import {useAppContext} from "../services/AppContextProvider";
import KineticsModelOptions from "./KineticsModelOptions";
import InlineFormSelect from "./InlineFormSelect";

export function AntibodyKinetics() {
    const {state, rService, dispatch} = useAppContext();
    const [plot, setPlot] = useState<PlotlyProps | null>(null);

    const plotError = useAsyncEffectSafely(async () => {
        if (state.demography.numIndividuals > 0 && state.demography.tmax > 0 && state.exposureTypes.length > 0) {
            setPlot(null)
            const plot = await rService.getKineticsPlot(state.kineticsFunction, state.exposureTypes, state.kinetics, state.demography.numIndividuals, state.demography.tmax);
            setPlot(plot)
        }
    }, [rService, state.exposureTypes, state.kinetics, state.demography.numIndividuals]);


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
            <Row><Col>
                <InlineFormSelect value={state.kineticsFunction}
                                  label={"Kinetic function"}
                                  handleChange={setKineticFunction}>
                    <option value={"monophasic"}>Monophasic decay</option>
                    <option value={"biphasic"}>Biphasic decay</option>
                </InlineFormSelect>
            </Col></Row>
            <Row>

                <Col>
                    {state.exposureTypes.map(e => <KineticsModelOptions
                        key={e.exposureType} exposureType={e.exposureType}/>)}
                </Col>
                <Col>
                    <PlotlyPlot plot={plot} error={plotError}></PlotlyPlot>
                </Col>
            </Row>
        </Col>
    </Row>
}
