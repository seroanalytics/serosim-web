import {render, screen} from "@testing-library/react";
import {mockAppState, mockKineticsModel} from "../mocks";
import {AppContext} from "../../src/services/AppContextProvider";
import {MockRService} from "../mockRService";
import React from "react";
import {userEvent} from "@testing-library/user-event";
import {ActionType} from "../../src/types";
import {AntibodyKinetics} from "../../src/components/AntibodyKinetics";

describe("<AntibodyKinetics>", () => {

    it("can update kinetics function", async () => {
        const state = mockAppState({
            rReady: true,
            exposureTypes: [{
                exposureType: "vax",
                isVax: true,
                age: 2,
                FOE: 0.2
            }],
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
                }}><AntibodyKinetics/>
            </AppContext.Provider>);

        const select = screen.getByRole("combobox") as HTMLSelectElement;
        expect(select.value).toBe("monophasic");

        await userEvent.selectOptions(select, "biphasic");

        expect(dispatch.mock.calls[0][0]).toEqual({
            type: ActionType.SET_KINETICS_FUNCTION,
            payload: "biphasic"
        });
    });

})
