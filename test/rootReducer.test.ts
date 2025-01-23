import {Action, ActionType} from "../src/types";
import {
    mockAppState,
    mockExposureType,
    mockImmunityModel,
    mockKineticsModel, mockObsModel
} from "./mocks";
import {rootReducer} from "../src/rootReducer";
import {WebRDataJs} from "webr/dist/webR/robj";
import {scenarios} from "../src/scenarios";

describe("rootReducer", () => {

    it("updates kinetics function", () => {
        const action: Action = {
            type: ActionType.SET_KINETICS_FUNCTION,
            payload: "monophasic"
        }
        const state = mockAppState();
        const result = rootReducer(state, action);
        expect(result.kineticsFunction).toBe("monophasic");
    });

    it("updates kinetic model parameters", () => {
        const action: Action = {
            type: ActionType.SET_KINETICS,
            payload: {
                exposureType: "vax",
                model: {"boost": 2}
            }
        }
        const state = mockAppState({
            kinetics: {
                "vax": mockKineticsModel()
            }
        });
        const result = rootReducer(state, action);
        expect(result.kinetics["vax"]).toEqual({
            boost: 2,
            wane: 0,
            boostShort: 0,
            waneShort: 0
        })
    });

    it("sets RReady", () => {
        let action: Action = {
            type: ActionType.R_READY,
            payload: true
        }
        const state = mockAppState();
        let result = rootReducer(state, action);
        expect(result.rReady).toBe(true);
        action = {
            type: ActionType.R_READY,
            payload: false
        }
        result = rootReducer(state, action);
        expect(result.rReady).toBe(false);
    });

    it("retains demography object and rReady after scenario loaded", () => {
        let action: Action = {
            type: ActionType.LOAD_SCENARIO,
            payload: "measles"
        }
        const state = mockAppState({
            rReady: true
        });
        state.demography.rObj = {type: "list", names: ["test"]} as WebRDataJs
        const result = rootReducer(state, action);

        expect(result.rReady).toBe(true);
        expect(result.demography.rObj).toEqual({type: "list", names: ["test"]})
        expect(result.immunityModel).toEqual(scenarios["measles"].immunityModel);
    });

    [
        {
            type: ActionType.ADD_EXPOSURE_TYPE,
            payload: mockExposureType()
        },
        {
            type: ActionType.REMOVE_EXPOSURE_TYPE,
            payload: mockExposureType()
        },
        {
            type: ActionType.SET_BIOMARKER,
            payload: "IgG"
        },
        {
            type: ActionType.SET_KINETICS,
            payload: mockKineticsModel()
        },
        {
            type: ActionType.SET_DEMOGRAPHY,
            payload: {tmax: 1}
        },
        {
            type: ActionType.SET_KINETICS_FUNCTION,
            payload: "biphasic"
        },
        {
            type: ActionType.SET_IMMUNITY_MODEL,
            payload: mockImmunityModel()
        },
        {
            type: ActionType.SET_OBSERVATION_MODEL,
            payload: mockObsModel()
        }
    ].forEach((a: Action) => {
        it(`${a.type} sets inputsChanged`, () => {
            const state = mockAppState({inputsChanged: false})
            const result = rootReducer(state, a)
            expect(result.inputsChanged).toBe(true);
        })
    });

    it("can set inputsChanged", () => {
        let state = mockAppState()
        let action = {
            type: ActionType.INPUTS_CHANGED,
            payload: true
        }

        state = rootReducer(state, action);
        expect(state.inputsChanged).toBe(true);

        action = {
            type: ActionType.INPUTS_CHANGED,
            payload: false
        }

        state = rootReducer(state, action);
        expect(state.inputsChanged).toBe(false);
    });

    it("sets result if inputs have not changed", () => {
        const state = mockAppState({
            inputsChanged: false
        })
        const action = {
            type: ActionType.SET_RESULTS,
            payload: "TEST"
        }

        const result = rootReducer(state, action);
        expect(result.result).toBe("TEST");
    });

    it("does not set result if inputs have changed", () => {
        const state = mockAppState({
            inputsChanged: true
        })
        const action = {
            type: ActionType.SET_RESULTS,
            payload: "TEST"
        }

        const result = rootReducer(state, action);
        expect(result.result).toBe(null);
    });

    it("can add exposure type", () => {
        const state = mockAppState({
            exposureTypes: []
        })
        const action = {
            type: ActionType.ADD_EXPOSURE_TYPE,
            payload: mockExposureType({
                exposureType: "test"
            })
        }
        const result = rootReducer(state, action);
        expect(result.exposureTypes[0]).toEqual(mockExposureType(
            {
                exposureType: "test"
            }
        ));
        expect(state.kinetics["test"]).toEqual(mockKineticsModel());
    })

    it("can remove exposure type", () => {
        const state = mockAppState({
            exposureTypes: [mockExposureType({
                exposureType: "test"
            })],
            kinetics: {
                "test": mockKineticsModel()
            }
        })
        const action = {
            type: ActionType.REMOVE_EXPOSURE_TYPE,
            payload: mockExposureType({
                exposureType: "test"
            })
        }
        const result = rootReducer(state, action);
        expect(result.exposureTypes.length).toBe(0);
        expect(Object.keys(result.kinetics).length).toBe(0);
    })
});
