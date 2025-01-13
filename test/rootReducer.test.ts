import {Action, ActionType} from "../src/types";
import {mockAppState, mockKineticsModel} from "./mocks";
import {rootReducer} from "../src/rootReducer";

describe("rootReducer", () => {

    it("updates kinetic model type", () => {
        const action: Action = {
            type: ActionType.SET_KINETICS_TYPE,
            payload: {
                exposureType: "vax",
                type: "teunis"
            }
        }
        const state = mockAppState({
            kinetics: {
                "vax": mockKineticsModel()
            }
        });

        const result = rootReducer(state, action);
        expect(result.kinetics["vax"]).toEqual({
            type: "teunis",
            model: {
                tPeak: 0,
                peak: 0,
                v: 0,
                k: 0,
                r: 0
            }
        })
    });

    it("updates kinetic model properties", () => {
        const action: Action = {
            type: ActionType.SET_KINETICS,
            payload: {
                exposureType: "vax",
                model: {"boostLong": 2}
            }
        }
        const state = mockAppState({
            kinetics: {
                "vax": mockKineticsModel()
            }
        });
        const result = rootReducer(state, action);
        expect(result.kinetics["vax"]).toEqual({
            type: "biphasic",
            model: {
                boostLong: 2,
                boostShort: 0,
                waneLong: 0,
                waneShort: 0
            }
        })
    });
});