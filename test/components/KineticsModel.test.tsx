import {render, screen} from "@testing-library/react";
import KineticsModel from "../../src/components/KineticsModel";
import {mockAppState, mockKineticsModel} from "../mocks";
import {AppContext} from "../../src/services/AppContextProvider";
import {MockRService} from "../mockRService";
import React from "react";
import {userEvent} from "@testing-library/user-event";
import {ActionType, AppState, BiphasicDecay} from "../../src/types";
import {rootReducer} from "../../src/rootReducer";

describe("<KineticsModel>", () => {

    it("can update function type", async () => {
        const state = mockAppState({
            kinetics: {
                "vax": mockKineticsModel()
            }
        });
        const dispatch = jest.fn();

        render(
            <AppContext.Provider
                value={{
                    dispatch,
                    state,
                    rService: new MockRService()
                }}><KineticsModel exposureType={"vax"}/>
            </AppContext.Provider>);

        const select = screen.getByRole("combobox") as HTMLSelectElement;
        expect(select.value).toBe("biphasic");

        await userEvent.selectOptions(select, "teunis");

        expect(dispatch.mock.calls[0][0]).toEqual({
            type: ActionType.SET_KINETICS_TYPE,
            payload: {
                exposureType: "vax",
                type: "teunis"
            }
        });

        const result = rootReducer(state, dispatch.mock.calls[0][0]);
        expect(result.kinetics["vax"].type).toBe("teunis")
    });

    it("renders biphasic decay function parameters", async () => {
        const state = mockAppState({
            kinetics: {
                "vax": mockKineticsModel()
            }
        });
        const dispatch = jest.fn();

        render(
            <AppContext.Provider
                value={{
                    dispatch,
                    state,
                    rService: new MockRService()
                }}><KineticsModel exposureType={"vax"}/>
            </AppContext.Provider>);

        const inputs = screen.getAllByRole("spinbutton");
        expect(inputs.length).toBe(4);
        expect(screen.getByLabelText("Wane short")).toBeInTheDocument();
        expect(screen.getByLabelText("Wane long")).toBeInTheDocument();
        expect(screen.getByLabelText("Boost long")).toBeInTheDocument();
        expect(screen.getByLabelText("Boost short")).toBeInTheDocument();
    });

    it("renders Teunis 2016 function parameters", async () => {
        const state = mockAppState({
            kinetics: {
                "vax": mockKineticsModel({
                    type: "teunis",
                    model: {
                        tPeak: 0,
                        peak: 0,
                        k: 0,
                        v: 0,
                        r: 0
                    }
                })
            }
        });
        const dispatch = jest.fn();

        render(
            <AppContext.Provider
                value={{
                    dispatch,
                    state,
                    rService: new MockRService()
                }}><KineticsModel exposureType={"vax"}/>
            </AppContext.Provider>);

        const inputs = screen.getAllByRole("spinbutton");
        console.log(screen.getByLabelText("Peak"))
        expect(inputs.length).toBe(5);
        expect(screen.getByLabelText("Time at peak")).toBeInTheDocument();
        expect(screen.getByLabelText("Peak")).toBeInTheDocument();
        expect(screen.getByLabelText("k")).toBeInTheDocument();
        expect(screen.getByLabelText("v")).toBeInTheDocument();
        expect(screen.getByLabelText("r")).toBeInTheDocument();
    });

    it("can update biphasic decay function parameters", async () => {
        const state = mockAppState({
            kinetics: {
                "vax": mockKineticsModel()
            }
        });
        const dispatch = jest.fn();

        render(
            <AppContext.Provider
                value={{
                    dispatch,
                    state,
                    rService: new MockRService()
                }}><KineticsModel exposureType={"vax"}/>
            </AppContext.Provider>);

        await assertParameterUpdated(state, dispatch, 0, "waneShort", "Wane short");
        await assertParameterUpdated(state, dispatch, 1, "waneLong", "Wane long");
        await assertParameterUpdated(state, dispatch, 2, "boostLong", "Boost long");
        await assertParameterUpdated(state, dispatch, 3, "boostShort", "Boost short");
    });

    it("can update Teunis 2016 function parameters", async () => {
        const state = mockAppState({
            kinetics: {
                "vax": mockKineticsModel({
                    type: "teunis",
                    model: {tPeak: 0, peak: 0, k: 0, v: 0, r: 0}
                })
            }
        });
        const dispatch = jest.fn();

        render(
            <AppContext.Provider
                value={{
                    dispatch,
                    state,
                    rService: new MockRService()
                }}><KineticsModel exposureType={"vax"}/>
            </AppContext.Provider>);

        await assertParameterUpdated(state, dispatch, 0, "tPeak", "Time at peak");
        await assertParameterUpdated(state, dispatch, 1, "peak", "Peak");
        await assertParameterUpdated(state, dispatch, 2, "k", "k");
        await assertParameterUpdated(state, dispatch, 3, "v", "v");
        await assertParameterUpdated(state, dispatch, 4, "r", "r");
    });
})

async function assertParameterUpdated(state: AppState, dispatch: jest.Mock, call: number, name: string, label: string) {
    const input = screen.getByLabelText(label);
    await userEvent.type(input, "1");
    const result = rootReducer(state, dispatch.mock.calls[call][0]);
    expect((result.kinetics["vax"].model as any)[name]).toBe(1)
}
