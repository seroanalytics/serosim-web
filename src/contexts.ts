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
    ADD_DEMOGRAPHY = "ADD_DEMOGRAPHY",
    R_READY = "R_READY"
}

export interface Action {
    type: ActionType
    payload: any
}

export const initialState: AppState = {
    genericErrors: [],
    biomarkerExposurePairs: [{
        biomarker: "IgG",
        exposureType: "Delta",
        FOE: "1"
    },
        {biomarker: "IgG", exposureType: "Vax", FOE: "1"}],
    demography: {
        numIndividuals: 100,
        tmax: 100,
        rObj: null
    },
    rReady: false,
    kinetics: {
        "IgGVax": {
            waneShort: 1,
            waneLong: 1,
            boostShort: 1,
            boostLong: 1
        },
        "IgGDelta": {
            waneShort: 1,
            waneLong: 1,
            boostShort: 1,
            boostLong: 1
        }
    },
    observationalModels: {
        "IgG": {
            upperBound: 100,
            lowerBound: 1,
            numBleeds: 1,
            error: 1
        }
    },
    immunityModels: {
        "IgG": {
            max: 100,
            midpoint: 25,
            variance: 1
        }
    }
}

export const RContext = createContext<RService>(new RService());
export const DispatchContext = createContext<Dispatch<Action>>(() => null);
export const StateContext = createContext<AppState>(initialState);
