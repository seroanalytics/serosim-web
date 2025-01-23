import {render, screen} from "@testing-library/react";
import {mockAppState} from "../mocks";
import {MockRService} from "../mockRService";
import {AppContext} from "../../src/services/AppContextProvider";
import React from "react";
import RunSerosim from "../../src/components/RunSerosim";
import {userEvent} from "@testing-library/user-event";
import {ActionType} from "../../src/types";

describe("<Runserosim/>", () => {


    it("clears results and sets inputsChanged to false before running serosim", async () => {
       const rService = new MockRService()
        const state = mockAppState({
            rReady: true
        });
        const dispatch = jest.fn();

        render(
            <AppContext.Provider
                value={{dispatch, state, rService}}><RunSerosim/>
            </AppContext.Provider>);

        const btn = screen.getByRole("button");
        await userEvent.click(btn);

        expect(dispatch.mock.calls[0][0]).toEqual({
            type: ActionType.SET_RESULTS,
            payload: null
        });

        expect(dispatch.mock.calls[1][0]).toEqual({
            type: ActionType.INPUTS_CHANGED,
            payload: false
        });
    });

    it("runs serosim and sets results", async () => {
        const rService = new MockRService();
        rService.runSerosim = jest.fn().mockImplementation(() => "TEST")
        const state = mockAppState({
            rReady: true
        });
        const dispatch = jest.fn();

        render(
            <AppContext.Provider
                value={{dispatch, state, rService}}><RunSerosim/>
            </AppContext.Provider>);

        const btn = screen.getByRole("button");
        await userEvent.click(btn);

        expect(dispatch.mock.calls[2][0]).toEqual({
            type: ActionType.SET_RESULTS,
            payload: "TEST"
        });
    });

    it("displays errors from running serosim", async () => {
        const rService = new MockRService();
        rService.runSerosim = jest.fn().mockImplementation(() => { throw Error("ERR")})
        const state = mockAppState({
            rReady: true
        });
        const dispatch = jest.fn();

        render(
            <AppContext.Provider
                value={{dispatch, state, rService}}><RunSerosim/>
            </AppContext.Provider>);

        const btn = screen.getByRole("button");
        await userEvent.click(btn);

        expect(dispatch.mock.calls.length).toBe(2);
        expect(screen.getByRole("alert").textContent).toMatch("ERR");
        expect(screen.getByRole<HTMLButtonElement>("button").disabled).toBe(false);
    });

    it("error is cleared if inputs are changed", async () => {
        const rService = new MockRService();
        rService.runSerosim = jest.fn().mockImplementation(() => { throw Error("ERR")})
        const state = mockAppState({
            rReady: true
        });
        const dispatch = jest.fn();

        const view = render(
            <AppContext.Provider
                value={{dispatch, state, rService}}><RunSerosim/>
            </AppContext.Provider>);

        const btn = screen.getByRole("button");
        await userEvent.click(btn);

        expect(dispatch.mock.calls.length).toBe(2);
        expect(screen.getByRole("alert").textContent).toMatch("ERR");
        expect(screen.getByRole<HTMLButtonElement>("button").disabled).toBe(false);

        state.inputsChanged = true;
        view.rerender( <AppContext.Provider
            value={{dispatch, state, rService}}><RunSerosim/>
        </AppContext.Provider>)

        expect(screen.queryByRole("alert")).toBe(null);
    });
});
