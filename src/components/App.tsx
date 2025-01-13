import React from "react";

import {Demography} from "./Demography";
import {Alert, Container} from "react-bootstrap";
import TopNav from "./TopNav";
import {ExposureTypes} from "./ExposureTypes";
import {AntibodyKinetics} from "./AntibodyKinetics";
import ObservationalModel from "./ObservationalModel";
import ImmunityModel from "./ImmunityModel";
import Results from "./Results";
import {LucideAlertTriangle} from "lucide-react";
import Stepper from "./Stepper";
import {AppContextProvider} from "../services/AppContextProvider";
import LoadScenarios from "./LoadScenarios";

const App = () => {

    return (
        <AppContextProvider>
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
            <TopNav/>
            <Container fluid={"sm"} className={"py-5"}>

                <p>Serosim is a an R package for simulating
                    serosurvey data. This app allows you to run
                    the package in the browser and download
                    outputs.</p>

                <LoadScenarios/>
                <Stepper/>
                <Demography/>
                <ObservationalModel/>
                <ImmunityModel/>
                <ExposureTypes/>
                <AntibodyKinetics/>
                <Results/>
            </Container>
        </AppContextProvider>
    );
};

export default App;
