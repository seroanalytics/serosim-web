import {createContext, Dispatch} from "react";
import {RService} from "./services/RService";
import {AppState, Step} from "./types";

export enum ActionType {
    ERROR_ADDED = "ERROR_ADDED",
    ERROR_DISMISSED = "ERROR_DISMISSED",
    CLEAR_ALL_ERRORS = "CLEAR_ALL_ERRORS",
    ADD_BIOMARKER_EXPOSURE_PAIR = "ADD_BIOMARKER_EXPOSURE_PAIR",
    REMOVE_BIOMARKER_EXPOSURE_PAIR = "REMOVE_BIOMARKER_EXPOSURE_PAIR",
    SET_IMMUNITY_MODEL = "SET_IMMUNITY_MODEL",
    SET_OBSERVATION_MODEL = "SET_OBSERVATION_MODEL",
    SET_KINETICS = "SET_KINETICS",
    SET_RESULTS = "SET_RESULTS",
    ADD_DEMOGRAPHY = "ADD_DEMOGRAPHY",
    R_READY = "R_READY",
    LOAD_SCENARIO = "LOAD_SCENARIO"
}

export interface Action {
    type: ActionType
    payload: any
}

export const initialSteps: Step[] = [
    {
        num: 1,
        name: "Define demography",
        complete: (state: AppState) => !!state.demography.rObj,
        ready:  (state: AppState) => true
    },
    {
        num: 2,
        name: "Define biomarkers & exposures",
        complete:  (state: AppState) =>  state.biomarkerExposurePairs.length > 0,
        ready: (state: AppState) => true
    },
    {
        num: 3,
        name: "Define antibody kinetics",
        complete: (state: AppState) => state.biomarkerExposurePairs.length > 0 && Object.values(state.kinetics).every(k => k.boostLong > 0 && k.boostShort > 0 && k.waneShort > 0 && k.waneLong > 0),
        ready: (state: AppState) => state.biomarkerExposurePairs.length > 0
    },
    {
        num: 4,
        name: "Define immunity model",
        complete: (state: AppState) => state.biomarkerExposurePairs.length > 0 && Object.values(state.immunityModels).every(m => m.max > 0 && m.midpoint > 0 && m.variance > 0),
        ready: (state: AppState) => state.biomarkerExposurePairs.length > 0
    },
    {
        num: 5,
        name: "Define observational model",
        complete: (state: AppState) => state.biomarkerExposurePairs.length > 0 && Object.values(state.observationalModels).every(m => m.numBleeds > 0),
        ready: (state: AppState) => state.biomarkerExposurePairs.length > 0
    },
    {
        num: 6,
        name: "Generate dataset",
        complete: (state: AppState) => !!state.result,
        ready: (state: AppState) => state.steps.slice(0, 4).every(s => s.complete(state))
    }
]

export const initialDemography = {
    numIndividuals: 100,
    tmax: 100,
    pRemoval: 1,
    rObj: null,
    requireRecalculation: true
}

export const initialState: AppState = {
    genericErrors: [],
    biomarkerExposurePairs: [],
    demography: initialDemography,
    rReady: false,
    kinetics: {},
    observationalModels: {},
    immunityModels: {},
    result: null,
    steps: initialSteps
}

export const rService = new RService();
rService.init();
export const RContext = createContext<RService>(rService);
export const DispatchContext = createContext<Dispatch<Action>>(() => null);
export const StateContext = createContext<AppState>(initialState);
