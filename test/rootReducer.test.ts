import {Action, ActionType} from "../src/types";
import {mockAppState, mockKineticsModel} from "./mocks";
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

});
