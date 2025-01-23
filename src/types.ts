import {WebRDataJs} from "webr/dist/webR/robj";

export interface Dict<T> {
    [index: string]: T
}

export interface PlotlyProps {
    data: any,
    layout: any
}

export interface ExposureType {
    exposureType: string
    FOE: number
    isVax: boolean
    age: number | null
}

export interface KineticsModel {
    boost: number
    wane: number
    boostShort: number
    waneShort: number
}

export interface ObservationalModel {
    error: number
    numBleeds: number
    type: "bounded" | "unbounded"
    lowerBound: number
    upperBound: number
}

export interface ImmunityModel {
    max: number
    midpoint: number
    variance: number
}

export interface Demography {
    rObj: WebRDataJs | null
    numIndividuals: number
    tmax: number
    pRemoval: number
}

export interface Step {
    num: number
    name: string
    complete: (state: AppState) => boolean
    ready: (state: AppState) => boolean
}

export interface AppState {
    biomarker: string
    exposureTypes: ExposureType[]
    kineticsFunction: "monophasic" | "biphasic"
    kinetics: Dict<KineticsModel>
    observationalModel: ObservationalModel
    immunityModel: ImmunityModel
    demography: Demography
    rReady: boolean
    result: any
    inputsChanged: boolean
    steps: Step[]
}

export enum ActionType {
    ADD_EXPOSURE_TYPE = "ADD_EXPOSURE_TYPE",
    REMOVE_EXPOSURE_TYPE = "REMOVE_EXPOSURE_TYPE",
    SET_BIOMARKER = "SET_BIOMARKER",
    SET_IMMUNITY_MODEL = "SET_IMMUNITY_MODEL",
    SET_OBSERVATION_MODEL = "SET_OBSERVATION_MODEL",
    SET_KINETICS_FUNCTION = "SET_KINETICS_FUNCTION",
    SET_KINETICS = "SET_KINETICS",
    SET_RESULTS = "SET_RESULTS",
    INPUTS_CHANGED = "INPUTS_CHANGED",
    SET_DEMOGRAPHY = "SET_DEMOGRAPHY",
    R_READY = "R_READY",
    LOAD_SCENARIO = "LOAD_SCENARIO"
}

export interface Action {
    type: ActionType
    payload: any
}

