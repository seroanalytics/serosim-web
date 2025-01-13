import {Col, Row} from "react-bootstrap";
import React, {useState} from "react";
import {PlotlyPlot} from "./PlotlyPlot";
import {useAsyncEffectSafely} from "../hooks/useAsyncEffectSafely";
import {PlotlyProps} from "../types";
import SectionError from "./SectionError";
import {useAppContext} from "../services/AppContextProvider";
import KineticsModel from "./KineticsModel";

export function AntibodyKinetics() {
    const {state, rService} = useAppContext();
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
                {state.exposureTypes.map(e => <KineticsModel
                    key={e.exposureType} exposureType={e.exposureType}/>)}
            </Col>
            <Col>
                <PlotlyPlot plot={plot} error={plotError}></PlotlyPlot>
            </Col>
        </Row>
    </Col>
    </Row>
}
