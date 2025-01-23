import {AppState, Dict, Step} from "./types";

const steps: Step[] = [
    {
        num: 1,
        name: "Define demography",
        complete: (state: AppState) => state.rReady && state.demography.tmax > 0 && state.demography.numIndividuals > 0 && !!state.demography.rObj,
        ready: (state: AppState) => true
    },
    {
        num: 2,
        name: "Define observational model",
        complete: (state: AppState) => state.rReady && !!state.observationalModel && state.observationalModel.numBleeds > 0,
        ready: (state: AppState) => true
    },
    {
        num: 3,
        name: "Define immunity model",
        complete: (state: AppState) => state.rReady && !!state.immunityModel && state.immunityModel.max > 0 && state.immunityModel.midpoint > 0 && state.immunityModel.variance > 0,
        ready: (state: AppState) => true
    },
    {
        num: 4,
        name: "Define exposures",
        complete: (state: AppState) => state.rReady && state.exposureTypes.length > 0,
        ready: (state: AppState) => true
    },
    {
        num: 5,
        name: "Define kinetics",
        complete: (state: AppState) => state.rReady && state.exposureTypes.length > 0, //&& Object.values(state.kinetics).every(k => k.boostLong > 0 || k.boostShort > 0 || k.waneShort > 0 || k.waneLong > 0),
        ready: (state: AppState) => state.rReady && state.exposureTypes.length > 0
    },
    {
        num: 6,
        name: "Generate dataset",
        complete: (state: AppState) => state.rReady && !!state.result,
        ready: (state: AppState) => state.steps.slice(0, 5).every(s => s.complete(state))
    }
]

const initialDemography = {
    numIndividuals: 0,
    tmax: 0,
    pRemoval: 0,
    rObj: null
}

const measles: AppState = {
    biomarker: "IgG",
    exposureTypes: [
        {
            exposureType: "Delta",
            FOE: 0.2,
            isVax: false,
            age: null
        },
        {
            exposureType: "Vax",
            FOE: 0.4,
            isVax: true,
            age: 9
        }],
    demography: {
        numIndividuals: 100,
        tmax: 100,
        pRemoval: 1,
        rObj: null
    },
    rReady: false,
    kineticsFunction: "biphasic",
    kinetics: {
        "Vax": {
                waneShort: 0,
                wane: 0,
                boostShort: 4,
                boost: 14
        },
        "Delta": {
                waneShort: 0,
                wane: 0,
                boostShort: 4,
                boost: 14
        }
    },
    observationalModel: {
        upperBound: 100,
        lowerBound: 1,
        numBleeds: 3,
        error: 1,
        type: "bounded"
    },
    immunityModel: {
        max: 14,
        midpoint: 7,
        variance: 1
    },
    result: null,
    inputsChanged: false,
    steps: steps
}

export const empty: AppState = {
    exposureTypes: [],
    demography: initialDemography,
    rReady: false,
    kinetics: {},
    kineticsFunction: "monophasic",
    observationalModel: {
        lowerBound: 0,
        upperBound: 0,
        numBleeds: 0,
        error: 0,
        type: "unbounded"
    },
    immunityModel: {
        max: 0,
        midpoint: 0,
        variance: 0
    },
    result: null,
    steps: steps,
    biomarker: "",
    inputsChanged: false
}

export const scenarios: Dict<AppState> = {
    "measles": measles,
    "empty": empty
}
