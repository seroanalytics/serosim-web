import {render, screen} from "@testing-library/react";
import KineticsModel from "../../src/components/KineticsModelOptions";
import {mockAppState, mockKineticsModel} from "../mocks";
import {AppContext} from "../../src/services/AppContextProvider";
import {MockRService} from "../mockRService";
import React from "react";
import {userEvent} from "@testing-library/user-event";
import {ActionType, AppState} from "../../src/types";
import {rootReducer} from "../../src/rootReducer";

describe("<KineticsModelOptions>", () => {

    it("renders biphasic function parameters", async () => {
        const state = mockAppState({
            kineticsFunction: "biphasic",
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

        await assertParameterUpdated(state, dispatch, 0, "waneShort", "Wane short");
        await assertParameterUpdated(state, dispatch, 1, "waneLong", "Wane long");
        await assertParameterUpdated(state, dispatch, 2, "boostLong", "Boost long");
        await assertParameterUpdated(state, dispatch, 3, "boostShort", "Boost short");
    });

    it("renders monophasic function parameters", async () => {
        const state = mockAppState({
            kineticsFunction: "monophasic",
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
        expect(inputs.length).toBe(2);
        expect(screen.getByLabelText("Wane")).toBeInTheDocument();
        expect(screen.getByLabelText("Boost")).toBeInTheDocument();

        await assertParameterUpdated(state, dispatch, 0, "boostLong", "Boost");
        await assertParameterUpdated(state, dispatch, 1, "waneLong", "Wane");
    });
})

async function assertParameterUpdated(state: AppState, dispatch: jest.Mock, call: number, name: string, label: string) {
    const input = screen.getByLabelText(label);
    await userEvent.type(input, "1");
    const result = rootReducer(state, dispatch.mock.calls[call][0]);
    expect((result.kinetics["vax"] as any)[name]).toBe(1)
}
