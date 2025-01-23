import {mockAppState} from "../mocks";
import {MockRService} from "../mockRService";
import {render, screen, waitFor} from "@testing-library/react";
import {AppContext} from "../../src/services/AppContextProvider";
import React from "react";
import {Demography} from "../../src/components/Demography";
import {userEvent} from "@testing-library/user-event";
import {ActionType} from "../../src/types";

describe("<Demography>", () => {

    it("does not render plot if any value is < 1", () => {
        const state = mockAppState();
        const dispatch = jest.fn();
        const rService = new MockRService();

        render(
            <AppContext.Provider
                value={{dispatch, state, rService}}><Demography/>
            </AppContext.Provider>);

        expect(screen.getAllByText("Choose a number of individuals and max time greater than 0").length).toBe(1);
        expect(rService.getDemography.mock.calls.length).toBe(0);
        expect(rService.getDemographyPlot.mock.calls.length).toBe(0);
    });

    it("renders plot if all values are > 1", async () => {
        const state = mockAppState({
            demography: {
                tmax: 10,
                numIndividuals: 10,
                pRemoval: 0.1,
                rObj: null
            }
        });
        const dispatch = jest.fn();
        const rService = new MockRService();

        render(
            <AppContext.Provider
                value={{dispatch, state, rService}}><Demography/>
            </AppContext.Provider>);

        expect(screen.queryByText("Choose a number of individuals and max time greater than 0")).toBe(null);

        await waitFor(() =>
            rService.getDemography.mock.calls.length === 1
        )
        await waitFor(() =>
            rService.getDemographyPlot.mock.calls.length === 1
        )
    });

    it("can set numIndividuals", async () => {
        const state = mockAppState();
        const dispatch = jest.fn();
        const rService = new MockRService();

        render(
            <AppContext.Provider
                value={{dispatch, state, rService}}><Demography/>
            </AppContext.Provider>);

        const numIndividuals = screen.getByLabelText("Number of individuals");
        await userEvent.type(numIndividuals, "1");

        expect(dispatch.mock.calls[0][0]).toEqual({
            type: ActionType.SET_DEMOGRAPHY,
            payload: {numIndividuals: 1}
        });
    });

    it("can set tmax", async () => {
        const state = mockAppState();
        const dispatch = jest.fn();
        const rService = new MockRService();

        render(
            <AppContext.Provider
                value={{dispatch, state, rService}}><Demography/>
            </AppContext.Provider>);

        const numIndividuals = screen.getByLabelText("Max time");
        await userEvent.type(numIndividuals, "1");

        expect(dispatch.mock.calls[0][0]).toEqual({
            type: ActionType.SET_DEMOGRAPHY,
            payload: {tmax: 1}
        });
    });

    it("can set pRemoval", async () => {
        const state = mockAppState();
        const dispatch = jest.fn();
        const rService = new MockRService();

        render(
            <AppContext.Provider
                value={{dispatch, state, rService}}><Demography/>
            </AppContext.Provider>);

        const numIndividuals = screen.getByLabelText("Probability of removal");
        await userEvent.type(numIndividuals, "1");

        expect(dispatch.mock.calls[0][0]).toEqual({
            type: ActionType.SET_DEMOGRAPHY,
            payload: {pRemoval: 1}
        });
    });
});
