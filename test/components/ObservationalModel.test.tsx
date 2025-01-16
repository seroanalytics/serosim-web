import {render, screen, waitFor} from "@testing-library/react";
import React from "react";
import ObservationalModel from "../../src/components/ObservationalModel";
import {mockAppState, mockObsModel} from "../mocks";
import {
    AppContext
} from "../../src/services/AppContextProvider";
import {userEvent} from "@testing-library/user-event";
import {ActionType} from "../../src/types";
import {MockRService} from "../mockRService";

describe("<ObservationalModel/>", () => {

    it("can select observational function", async () => {
        const state = mockAppState({
            observationalModel: mockObsModel({
                type: "bounded"
            })
        });
        const dispatch = jest.fn();

        render(
            <AppContext.Provider
                value={{
                    dispatch,
                    state,
                    rService: new MockRService()
                }}><ObservationalModel/>
            </AppContext.Provider>);

        const select = screen.getByRole("combobox") as HTMLSelectElement;
        expect(select.value).toBe("bounded");
        expect(select.item(0)!!.value).toBe("unbounded");
        expect(select.item(1)!!.value).toBe("bounded");
        expect(select.item(0)!!.text).toBe("Continuous-unbounded");
        expect(select.item(1)!!.text).toBe("Continuous-bounded");

        await userEvent.selectOptions(select, "unbounded");

        expect(dispatch.mock.calls[0][0]).toEqual({
            type: ActionType.SET_OBSERVATION_MODEL,
            payload: {type: "unbounded"}
        });
    });

    it("can select error and num bleeds", async () => {
        const state = mockAppState({
            observationalModel: mockObsModel({
                type: "bounded"
            })
        });
        const dispatch = jest.fn();

        render(
            <AppContext.Provider
                value={{
                    dispatch,
                    state,
                    rService: new MockRService()
                }}><ObservationalModel/>
            </AppContext.Provider>);

        const error = screen.getByLabelText("Error");
        await userEvent.type(error, "0.1");

        expect(dispatch.mock.calls[0][0]).toEqual({
            type: ActionType.SET_OBSERVATION_MODEL,
            payload: {error: 0.1}
        });

        const numBleeds = screen.getByLabelText("Number of bleeds per person");
        await userEvent.type(numBleeds, "3");

        expect(dispatch.mock.calls[1][0]).toEqual({
            type: ActionType.SET_OBSERVATION_MODEL,
            payload: {numBleeds: 3}
        });
    });

    it("can select bounds if model is bounded", async () => {
        const state = mockAppState({
            observationalModel: mockObsModel({
                type: "bounded"
            })
        });
        const dispatch = jest.fn();

        render(
            <AppContext.Provider
                value={{
                    dispatch,
                    state,
                    rService: new MockRService()
                }}><ObservationalModel/>
            </AppContext.Provider>);

        const inputs = screen.getAllByRole("spinbutton");
        expect(inputs.length).toBe(4);

        const lowerBound = screen.getByLabelText("Lower bound");
        await userEvent.type(lowerBound, "2");

        expect(dispatch.mock.calls[0][0]).toEqual({
            type: ActionType.SET_OBSERVATION_MODEL,
            payload: {lowerBound: 2}
        });

        const upperBound = screen.getByLabelText("Upper bound");
        await userEvent.type(upperBound, "9");

        expect(dispatch.mock.calls[1][0]).toEqual({
            type: ActionType.SET_OBSERVATION_MODEL,
            payload: {upperBound: 9}
        });
    });

    it("does not show bounds if model is unbounded", () => {
        const state = mockAppState();
        const dispatch = jest.fn();

        render(
            <AppContext.Provider
                value={{
                    dispatch,
                    state,
                    rService: new MockRService()
                }}><ObservationalModel/>
            </AppContext.Provider>);

        const inputs = screen.getAllByRole("spinbutton");
        expect(inputs.length).toBe(2);
    });

    it("does not render plot if numBleeds < 1", () => {
        const state = mockAppState();
        const dispatch = jest.fn();
        const rService = new MockRService();

        render(
            <AppContext.Provider
                value={{dispatch, state, rService}}><ObservationalModel/>
            </AppContext.Provider>);

        expect(screen.getAllByText("Choose at least 1 bleed per person").length).toBe(1);
        expect(rService.getObservationTimesPlot.mock.calls.length).toBe(0);
    })

    it("renders plot if numBleeds >= 1", async () => {
        const state = mockAppState({observationalModel: mockObsModel({numBleeds: 1})});
        const dispatch = jest.fn();
        const rService = new MockRService();

        render(
            <AppContext.Provider
                value={{dispatch, state, rService}}><ObservationalModel/>
            </AppContext.Provider>);

        expect(screen.queryByText("Choose at least 1 bleed per person")).toBe(null);

        await waitFor(() =>
            rService.getObservationTimesPlot.mock.calls.length === 1
        )
    })
})
