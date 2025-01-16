import {
    AppState, ExposureType, ImmunityModel, KineticsModel, ObservationalModel
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

export function mockImmunityModel(model: Partial<ImmunityModel> = {}): ImmunityModel {
    return {
        max: 14,
        midpoint: 7,
        variance: 0.1,
        ...model
    }
}

export function mockExposureType(exposure: Partial<ExposureType> = {}): ExposureType {
    return {
        isVax: true,
        age: 0,
        exposureType: "Vax",
        FOE: 0.1,
        ...exposure
    }
}

export function mockKineticsModel(model: Partial<KineticsModel> = {}): KineticsModel {
    return {
        waneShort: 0,
        wane: 0,
        boostShort: 0,
        boost: 0,
        ...model
    }
}

export function mockAppState(state: Partial<AppState> = {}): AppState {
    return {
        ...empty,
        ...state
    }
}
