import React, {useEffect, useReducer} from "react";
import {
    ActionType,
    DispatchContext,
    initialState,
    RContext, rService,
    StateContext
} from "../contexts";
import {Demography} from "./Demography";
import {Alert, Button, Container, Tab, Tabs} from "react-bootstrap";
import TopNav from "./TopNav";
import usePersistedState from "../hooks/usePersistedState";
import {rootReducer} from "../rootReducer";
import AppError from "./AppError";
import {BiomarkersAndExposureTypes} from "./BiomarkersAndExposureTypes";
import {AntibodyKinetics} from "./AntibodyKinetics";
import {ObservationalModels} from "./ObservationalModels";
import {ImmunityModels} from "./ImmunityModels";
import RunSerosim from "./RunSerosim";
import Results from "./Results";
import {
    InfoIcon, LucideAlertTriangle,
    LucideMessageCircleWarning,
    MessageCircleWarning
} from "lucide-react";

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
            });

        return () => {
            // rService.close()
        };
    }, []);

    const loadMeasles = () => {
        dispatch({
            type: ActionType.LOAD_SCENARIO,
            payload: "measles"
        })
    }

    const reset = () => {
        dispatch({
            type: ActionType.LOAD_SCENARIO,
            payload: "empty"
        })
    }

    return (
        <RContext.Provider value={rService}>
            <StateContext.Provider value={state}>
                <DispatchContext.Provider value={dispatch}>
                    <Alert variant={"warning"}
                           className={"rounded-0 border-0 mb-0"}>
                       <span className={"mx-2"}>
                            <LucideAlertTriangle/>
                        </span>
                        This site is using <a
                        href={"https://docs.r-wasm.org/webr/latest/"}>webR</a>:
                        a version of the statistical language R compiled for the
                        browser.
                        The webR project is under active development, and things
                        might break!
                    </Alert>
                    <TopNav theme={theme as string}
                            setTheme={setTheme as (newState: string) => void}></TopNav>
                    {state.genericErrors.map((e, index) => <AppError error={e}
                                                                     key={"error" + index}/>)}

                    <Container fluid={"sm"} className={"pt-5"}>

                        <p>Serosim is a an R package for simulating
                            serosurvey data. This app allows you to run
                            the package in the browser and download
                            outputs.</p>

                        <p>Preconfigured scenarios:</p>
                        <Button className={"me-2"} variant={"success"}
                                onClick={loadMeasles}>Measles</Button>
                        <Button onClick={reset} variant={"secondary"}>Reset all
                            fields</Button>
                        <BiomarkersAndExposureTypes/>
                        <AntibodyKinetics/>
                        <ObservationalModels/>
                        <ImmunityModels/>
                        <Demography/>
                        {/*<DemographyJs/>*/}
                        <RunSerosim/>
                        {state.result && <Results/>}
                    </Container>
                </DispatchContext.Provider>
            </StateContext.Provider>
        </RContext.Provider>
    );
};

export default App;
