import {
    AppState,
    BiomarkerExposurePair,
    BiphasicDecay,
    ContinuousBounded, Dict,
    ImmunityModel
} from "./types";
import {
    Action,
    ActionType,
    initialDemography,
    initialSteps,
} from "./contexts";

const measles = {
    genericErrors: [],
    biomarkerExposurePairs: [
        {
            biomarker: "IgG",
            exposureType: "Delta",
            FOE: "1"
        },
        {
            biomarker: "IgG",
            exposureType: "Vax",
            FOE: "1"
        }],
    demography: {
        numIndividuals: 100,
        tmax: 100,
        pRemoval: 1,
        rObj: null,
        requireRecalculation: true
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
    },
    result: null,
    steps: initialSteps
}

const scenarios: Dict<AppState> = {
    "measles": measles,
    "empty": {
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
}

export const rootReducer = (state: AppState, action: Action): AppState => {
    console.log(action.type);
    switch (action.type) {
        case ActionType.LOAD_SCENARIO:
            return {
                ...scenarios[action.payload as string],
                rReady: state.rReady
            }
        case ActionType.ERROR_ADDED:
            return {
                ...state,
                genericErrors: [...state.genericErrors, action.payload]
            }
        case ActionType.ERROR_DISMISSED:
            return {
                ...state,
                genericErrors: state.genericErrors.filter(e => e !== action.payload)
            }
        case ActionType.CLEAR_ALL_ERRORS:
            return {
                ...state,
                genericErrors: []
            }
        case ActionType.ADD_BIOMARKER_EXPOSURE_PAIR:
            return addBiomarkerExposurePair(state, action.payload)
        case ActionType.REMOVE_BIOMARKER_EXPOSURE_PAIR:
            return {
                ...state,
                biomarkerExposurePairs: [...state.biomarkerExposurePairs
                    .filter(p => p.biomarker !== action.payload.biomarker || p.exposureType !== action.payload.exposureType)]
            }
        case ActionType.SET_IMMUNITY_MODEL:
            return setImmunityModel(state, action.payload)
        case ActionType.SET_OBSERVATION_MODEL:
            return setObservationalModel(state, action.payload)
        case ActionType.SET_KINETICS:
            return setKinetics(state, action.payload)
        case ActionType.ADD_DEMOGRAPHY:
            return {
                ...state,
                demography: {
                    ...state.demography,
                    ...action.payload,
                    requireRecalculation: false
                }
            }
        case ActionType.SET_RESULTS:
            return {
                ...state,
                result: action.payload
            }
        case ActionType.R_READY:
            return {
                ...state,
                rReady: true
            }
        default:
            console.warn(`Unrecognised action type: ${action.type}`)
            return state
    }
}

function addBiomarkerExposurePair(state: AppState, payload: BiomarkerExposurePair) {
    const newState = {...state}
    if (!newState.immunityModels[payload.biomarker]) {
        newState.immunityModels[payload.biomarker] = {
            max: 0,
            midpoint: 0,
            variance: 0
        }
    }
    if (!newState.observationalModels[payload.biomarker]) {
        newState.observationalModels[payload.biomarker] = {
            error: 0,
            lowerBound: 0,
            upperBound: 0,
            numBleeds: 1
        }
    }
    if (!newState.kinetics[payload.biomarker + payload.exposureType]) {
        newState.kinetics[payload.biomarker + payload.exposureType] = {
            boostLong: 0,
            boostShort: 0,
            waneShort: 0,
            waneLong: 0
        }
    }
    newState.biomarkerExposurePairs = [...state.biomarkerExposurePairs, payload]
    return newState
}

function setImmunityModel(state: AppState, payload: {
    biomarker: string,
    model: ImmunityModel
}) {
    const newState = {...state}
    newState.immunityModels[payload.biomarker] = {...state.immunityModels[payload.biomarker], ...payload.model}
    return newState
}

function setObservationalModel(state: AppState, payload: {
    biomarker: string,
    model: ContinuousBounded
}) {
    const newState = {...state}
    newState.observationalModels[payload.biomarker] = {...state.observationalModels[payload.biomarker], ...payload.model}
    return newState
}

function setKinetics(state: AppState, payload: {
    pair: BiomarkerExposurePair,
    model: BiphasicDecay
}) {
    const newState = {...state}
    newState.kinetics[payload.pair.biomarker + payload.pair.exposureType] = {...state.kinetics[payload.pair.biomarker + payload.pair.exposureType], ...payload.model}
    return newState
}
