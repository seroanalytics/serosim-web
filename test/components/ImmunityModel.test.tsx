import {mockAppState} from "../mocks";
import {MockRService} from "../mockRService";
import {render, screen, waitFor} from "@testing-library/react";
import {AppContext} from "../../src/services/AppContextProvider";
import React from "react";
import ImmunityModel from "../../src/components/ImmunityModel";

describe("<ImmunityModel>", () => {

    it("does not render plot if any value is < 1", () => {
        const state = mockAppState();
        const dispatch = jest.fn();
        const rService = new MockRService();

        render(
            <AppContext.Provider
                value={{dispatch, state, rService}}><ImmunityModel/>
            </AppContext.Provider>);

        expect(screen.getAllByText("Choose a valid max and midpoint").length).toBe(1);
        expect(rService.getImmunityPlot.mock.calls.length).toBe(0);
    });

    it("renders plot if all values are > 1", async () => {
        const state = mockAppState({
            immunityModel: {
                max: 12,
                midpoint: 1,
                variance: 0.1
            }
        });
        const dispatch = jest.fn();
        const rService = new MockRService();

        render(
            <AppContext.Provider
                value={{dispatch, state, rService}}><ImmunityModel/>
            </AppContext.Provider>);

        expect(screen.queryByText("Choose a valid max and midpoint")).toBe(null);
        await waitFor(() =>
            rService.getImmunityPlot.mock.calls.length === 1
        )
    });

})