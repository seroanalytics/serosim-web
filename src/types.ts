import {WebRDataJs} from "webr/dist/webR/robj";

export interface Dict<T> {
    [index: string]: T
}

export interface PlotlyProps {
    data: any,
    layout: any
}

export interface BiomarkerExposurePair {
    biomarker: string
    exposureType: string
    FOE: string
}

export interface BiphasicDecay {
    boostLong: number
    boostShort: number
    waneShort: number
    waneLong: number
}

export interface Continuous {
    error: number
    numBleeds: number
}

export interface ContinuousBounded extends Continuous {
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
    requireRecalculation: boolean
}

export interface Step {
    num: number
    name: string
    complete: (state: AppState) => boolean
    ready: (state: AppState) => boolean
}

export interface AppState {
    biomarkerExposurePairs: BiomarkerExposurePair[]
    kinetics: Dict<BiphasicDecay>
    observationalModels: Dict<ContinuousBounded>
    immunityModels: Dict<ImmunityModel>
    demography: Demography
    genericErrors: string[]
    rReady: boolean
    result: any
    steps: Step[]
}
