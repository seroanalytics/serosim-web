import {
    AppState,
    BiomarkerExposurePair, BiphasicDecay,
    ContinuousBounded,
    ImmunityModel
} from "./types";
import {Action, ActionType} from "./contexts";

export const rootReducer = (state: AppState, action: Action): AppState => {
    console.log(action.type);
    switch (action.type) {
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
                    .filter(p => p.biomarker !== action.payload.biomarker && p.exposureType !== action.payload.exposureType)]
            }
        case ActionType.SET_IMMUNITY_MODEL:
            return setImmunityModel(state, action.payload)
        case ActionType.SET_OBSERVATION_MODEL:
            return setObservationalModel(state, action.payload)
        case ActionType.SET_KINETICS:
            return setKinetics(state, action.payload)
        case ActionType.R_READY:
            return {
                ...state,
                rReady: true
            }
        case ActionType.ADD_DEMOGRAPHY:
            return {
                ...state,
                demography: {
                    ...state.demography,
                    rObj: action.payload
                }
            }
        default:
            console.warn(`Unrecognised action type: ${action.type}`)
            return state
    }
}

function addBiomarkerExposurePair(state: AppState, payload: BiomarkerExposurePair) {
    const newState = {...state}
    if (!newState.immunityModels[payload.biomarker]) {
        newState.immunityModels[payload.biomarker] = {max: 0, midpoint: 0, variance: 0}
    }
    if (!newState.observationalModels[payload.biomarker]) {
        newState.observationalModels[payload.biomarker] = {error: 0, lowerBound: 0, upperBound: 0, numBleeds: 1}
    }
    if (!newState.kinetics[payload.biomarker+payload.exposureType]) {
        newState.kinetics[payload.biomarker+payload.exposureType] = {boostLong: 0, boostShort: 0, waneShort: 0, waneLong: 0}
    }
    newState.biomarkerExposurePairs = [...state.biomarkerExposurePairs, payload]
    return newState
}

function setImmunityModel(state: AppState, payload: {biomarker: string, model: ImmunityModel}) {
    const newState = {...state}
    newState.immunityModels[payload.biomarker] = {...state.immunityModels[payload.biomarker], ...payload.model}
    return  newState
}

function setObservationalModel(state: AppState, payload: {biomarker: string, model: ContinuousBounded}) {
    const newState = {...state}
    newState.observationalModels[payload.biomarker] = {...state.observationalModels[payload.biomarker], ...payload.model}
    return  newState
}

function setKinetics(state: AppState, payload: {pair: BiomarkerExposurePair, model: BiphasicDecay}) {
    const newState = {...state}
    newState.kinetics[payload.pair.biomarker+payload.pair.exposureType] = {...state.kinetics[payload.pair.biomarker+payload.pair.exposureType], ...payload.model}
    return  newState
}
