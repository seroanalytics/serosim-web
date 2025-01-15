import {Action, ActionType} from "../src/types";
import {mockAppState, mockKineticsModel} from "./mocks";
import {rootReducer} from "../src/rootReducer";

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
});
