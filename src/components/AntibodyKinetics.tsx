import {Col, Row} from "react-bootstrap";
import React, {useContext, useState} from "react";
import {RContext, StateContext} from "../contexts";
import BiphasicDecay from "./BiphasicDecay";
import {PlotlyPlot} from "./PlotlyPlot";
import {useAsyncEffectSafely} from "../hooks/useAsyncEffectSafely";
import {PlotlyProps} from "../types";
import SectionError from "./SectionError";

export function AntibodyKinetics() {
    const state = useContext(StateContext);
    const rService = useContext(RContext);
    const [plot, setPlot] = useState<PlotlyProps | null>(null);

    const plotError = useAsyncEffectSafely(async () => {
        if (state.demography.numIndividuals > 0 && state.demography.tmax > 0 && state.exposureTypes.length > 0) {
            setPlot(null)
            const plot = await rService.getKineticsPlot(state.exposureTypes, state.kinetics, state.demography.numIndividuals, state.demography.tmax);
            setPlot(plot)
        }
    }, [rService, state.exposureTypes, state.kinetics, state.demography.numIndividuals]);


    if (!state.steps[4].ready(state)) {
        return null
    }

    return <Row><Col className={"pt-4"}>
        <h4>5. Define antibody kinetics</h4>
        <Row>
            <div className={"pb-2"}>
                <SectionError error={plotError}/>
            </div>
            <Col>
                {state.exposureTypes.map(e => <BiphasicDecay
                    key={e.exposureType} exposureType={e}/>)}
            </Col>
            <Col>
                <PlotlyPlot plot={plot} error={plotError}></PlotlyPlot>
            </Col>
        </Row>
    </Col>
    </Row>
}
