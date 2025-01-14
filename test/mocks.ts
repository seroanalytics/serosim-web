import {
    AppState, KineticsModel, ObservationalModel
} from "../src/types";
import {empty} from "../src/scenarios";


export function mockObsModel(model: Partial<ObservationalModel> = {}): ObservationalModel {
    return {
        type: "unbounded",
        error: 0,
        lowerBound: 0,
        upperBound: 0,
        numBleeds: 0,
        ...model
    }
}

export function mockKineticsModel(model: Partial<KineticsModel> = {}): KineticsModel {
    return {
        waneShort: 0,
        waneLong: 0,
        boostShort: 0,
        boostLong: 0,
        ...model
    }
}

export function mockAppState(state: Partial<AppState> = {}): AppState {
    return {
        ...empty,
        ...state
    }
}
