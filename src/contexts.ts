import {createContext, Dispatch} from "react";
import {RService} from "./services/RService";
import {AppState} from "./types";

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

export const initialState: AppState = {
    genericErrors: [],
    biomarkerExposurePairs: [],
    demography: {
        numIndividuals: 0,
        tmax: 0,
        pRemoval: 0,
        rObj: null
    },
    rReady: false,
    kinetics: {},
    observationalModels: {},
    immunityModels: {},
    result: null
}

export const rService = new RService();
rService.init();
export const RContext = createContext<RService>(rService);
export const DispatchContext = createContext<Dispatch<Action>>(() => null);
export const StateContext = createContext<AppState>(initialState);
