import {
    AppState,
    ExposureType,
    ImmunityModel,
    ObservationalModel, Action, ActionType, KineticsModel
} from "./types";
import {scenarios} from "./scenarios";

export const rootReducer = (state: AppState, action: Action): AppState => {
    console.log(action.type);
    switch (action.type) {
        case ActionType.LOAD_SCENARIO:
            const demographyRObj = state.demography.rObj
            const newState = {
                ...scenarios[action.payload as string],
                rReady: state.rReady
            }
            // If demographic params haven't changed, this will still be valid.
            // If they have changed, the component will trigger a recalculation.
            newState.demography.rObj = demographyRObj;
            return newState
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
        case ActionType.SET_KINETICS_FUNCTION:
            return {...state, kineticsFunction: action.payload}
        case ActionType.SET_KINETICS:
            return setKinetics(state, action.payload)
        case ActionType.SET_BIOMARKER:
            return setBiomarker(state, action.payload)
        case ActionType.SET_DEMOGRAPHY:
            return {
                ...state,
                result: null,
                demography: {
                    ...state.demography,
                    ...action.payload
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
                rReady: action.payload
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
            numBleeds: 0,
            type: "unbounded"
        }
    }
    return newState
}

function addExposureType(state: AppState, payload: ExposureType) {
    const newState = {...state, result: null}
    if (!newState.kinetics[payload.exposureType]) {
        newState.kinetics[payload.exposureType] = {
                boost: 0,
                boostShort: 0,
                waneShort: 0,
                wane: 0
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

function setObservationalModel(state: AppState, payload: ObservationalModel) {
    const newState = {...state, result: null}
    newState.observationalModel = {...state.observationalModel, ...payload}
    return newState
}

function setKinetics(state: AppState, payload: {
    exposureType: string,
    model: KineticsModel
}) {
    const newState = {...state, result: null}
    newState.kinetics = {...state.kinetics}
    newState.kinetics[payload.exposureType] = {...state.kinetics[payload.exposureType], ...payload.model}
    return newState
}
