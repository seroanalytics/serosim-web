import React, {useEffect, useMemo, useReducer} from "react";
import {
    ActionType,
    DispatchContext,
    initialState,
    RContext,
    StateContext
} from "../contexts";
import {RService} from "../services/RService";
import {Demography} from "./Demography";
import {Button, Col, Container, Row} from "react-bootstrap";
import TopNav from "./TopNav";
import usePersistedState from "../hooks/usePersistedState";
import {rootReducer} from "../rootReducer";
import AppError from "./AppError";
import {BiomarkersAndExposureTypes} from "./BiomarkersAndExposureTypes";
import {AntibodyKinetics} from "./AntibodyKinetics";
import {ObservationalModels} from "./ObservationalModels";
import {ImmunityModels} from "./ImmunityModels";

declare const rService: RService

const App = () => {

    const [theme, setTheme] = usePersistedState<string>("theme", "dark");
    const [state, dispatch] = useReducer(rootReducer, initialState);

    useEffect(() => {
        rService
            .waitForReady()
            .then(() => {
                dispatch({
                    type: ActionType.R_READY,
                    payload: true
                });
                rService.convertObject()
            });
    }, []);

    return (
        <RContext.Provider value={rService}>
            <StateContext.Provider value={state}>
                <DispatchContext.Provider value={dispatch}>
                    <TopNav theme={theme as string}
                            setTheme={setTheme as (newState: string) => void}></TopNav>
                    {state.genericErrors.map((e, index) => <AppError error={e}
                                                                     key={"error" + index}/>)}
                    <Container fluid>
                        <Demography/>
                        <BiomarkersAndExposureTypes/>
                        <AntibodyKinetics/>
                        <ObservationalModels/>
                        <ImmunityModels/>
                        <Row className={"my-3 text-center"}>
                            <Col>
                                <Button type={"submit"} size={"lg"}
                                        disabled={!state.rReady}
                                        onClick={() => rService.runSerosim(state)}>
                                    Generate dataset
                                </Button>
                            </Col>
                        </Row>
                    </Container>
                </DispatchContext.Provider>
            </StateContext.Provider>
        </RContext.Provider>
    );
};

export default App;
