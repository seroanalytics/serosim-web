import {mockAppState} from "../mocks";
import {MockRService} from "../mockRService";
import {render, screen} from "@testing-library/react";
import {AppContext} from "../../src/services/AppContextProvider";
import React from "react";
import Results from "../../src/components/Results";
import {WebRDataJs} from "webr/dist/webR/robj";
import {scenarios} from "../../src/scenarios";

describe("<Results>", () => {

    const plotTitle = ["individual-biomarker-kinetics", "true-biomarker-quantity", "individual-immune-history"]

    it("does not render anything if not ready", () => {
        const state = mockAppState()
        const dispatch = jest.fn();
        const rService = new MockRService();

        expect(state.steps[5].ready(state)).toBe(false);

        render(
            <AppContext.Provider
                value={{dispatch, state, rService}}><Results/>
            </AppContext.Provider>);

        expect(screen.queryAllByRole("button").length).toBe(0);
    })

    it("does not render download buttons or plots if results are null", () => {
        const state = getReadyState()
        const dispatch = jest.fn();
        const rService = new MockRService();

        expect(state.steps[5].ready(state)).toBe(true);

        render(
            <AppContext.Provider
                value={{dispatch, state, rService}}><Results/>
            </AppContext.Provider>);

        expect(screen.queryAllByRole("button").length).toBe(1);
        expect(screen.getByRole("button").textContent).toBe("Generate dataset")
        expect(screen.queryByTestId(plotTitle[0])).toBeNull();
        expect(screen.queryByText("Generating plot")).toBeNull();
    })

    it("renders download buttons and plots if results are not null", () => {
        const state = getReadyState()
        state.result = {type: "list"} as WebRDataJs

        const dispatch = jest.fn();
        const rService = new MockRService();

        render(
            <AppContext.Provider
                value={{dispatch, state, rService}}>
                <Results/>
            </AppContext.Provider>);

        expect(screen.queryAllByRole("button").length).toBe(5);
        expect(screen.getAllByText("Generating plot").length).toBe(3);
    });

    it("download plots button is disabled when plots are null", () => {
        const state = getReadyState()
        state.result = {type: "list"} as WebRDataJs

        const dispatch = jest.fn();
        const rService = new MockRService();

        render(
            <AppContext.Provider
                value={{dispatch, state, rService}}>
                <Results/>
            </AppContext.Provider>);

        expect(screen.getByText<HTMLButtonElement>("Download output plots")
            .disabled).toBe(true);
    });

});

const getReadyState = () => {
    const state = mockAppState(scenarios["measles"])
    state.rReady = true
    state.demography.rObj = {type: "list"} as WebRDataJs

    expect(state.steps[5].ready(state)).toBe(true);
    return state
}
