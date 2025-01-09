import {
    AppState,
    ExposureType,
    BiphasicDecay,
    ContinuousBounded,
    ImmunityModel
} from "./types";
import {
    Action,
    ActionType
} from "./contexts";
import {scenarios} from "./scenarios";


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
        case ActionType.ADD_EXPOSURE_TYPE:
            return addExposureType(state, action.payload)
        case ActionType.REMOVE_EXPOSURE_TYPE:
            return {
                ...state,
                result: null,
                exposureTypes: [...state.exposureTypes
                    .filter(p => p.exposureType !== action.payload.exposureType)]
            }
        case ActionType.SET_IMMUNITY_MODEL:
            return setImmunityModel(state, action.payload)
        case ActionType.SET_OBSERVATION_MODEL:
            return setObservationalModel(state, action.payload)
        case ActionType.SET_KINETICS:
            return setKinetics(state, action.payload)
        case ActionType.SET_BIOMARKER:
            return setBiomarker(state, action.payload)
        case ActionType.ADD_DEMOGRAPHY:
            return {
                ...state,
                result: null,
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

function setBiomarker(state: AppState, payload: string) {
    const newState = {...state, biomarker: payload, result: null}
    if (!newState.immunityModel) {
        newState.immunityModel = {
            max: 0,
            midpoint: 0,
            variance: 0
        }
    }
    if (!newState.observationalModel) {
        newState.observationalModel = {
            error: 0,
            lowerBound: 0,
            upperBound: 0,
            numBleeds: 1
        }
    }
    return newState
}

function addExposureType(state: AppState, payload: ExposureType) {
    const newState = {...state, result: null}
    if (!newState.kinetics[payload.exposureType]) {
        newState.kinetics[payload.exposureType] = {
            boostLong: 0,
            boostShort: 0,
            waneShort: 0,
            waneLong: 0
        }
    }
    newState.exposureTypes = [...state.exposureTypes, payload]
    return newState
}

function setImmunityModel(state: AppState, payload: ImmunityModel) {
    const newState = {...state, result: null}
    newState.immunityModel = {...state.immunityModel, ...payload}
    return newState
}

function setObservationalModel(state: AppState, payload: ContinuousBounded) {
    const newState = {...state, result: null}
    newState.observationalModel = {...state.observationalModel, ...payload}
    return newState
}

function setKinetics(state: AppState, payload: {
    exposure: ExposureType,
    model: BiphasicDecay
}) {
    const newState = {...state, result: null}
    newState.kinetics = {...state.kinetics}
    newState.kinetics[payload.exposure.exposureType] = {...state.kinetics[payload.exposure.exposureType], ...payload.model}
    return newState
}
