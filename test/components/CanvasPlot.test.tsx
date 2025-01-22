import {render, screen} from "@testing-library/react";
import React from "react";
import {CanvasPlot} from "../../src/components/CanvasPlot";
import {AppContext} from "../../src/services/AppContextProvider";
import {mockAppState, mockImageBitmap} from "../mocks";
import {MockRService} from "../mockRService";

describe("<CanvasPlot>", () => {

    it("renders loader and waiting for R message if plot is null and r is not ready", () => {
        const state = mockAppState({rReady: false});
        const dispatch = jest.fn();
        const rService = new MockRService();

        render(<AppContext.Provider value={{dispatch, state, rService}}>
            <CanvasPlot plot={null} title={"test title"}
                        error={""}/></AppContext.Provider>);
        expect(screen.getByRole("loader")).not.toBeNull();
        expect(screen.queryByTestId("test title")).toBe(null);
        expect(screen.getByText("Waiting for R to be ready")).not.toBeNull();
    });


    it("renders loader and loading message if plot is null and r is ready", () => {
        const state = mockAppState({rReady: true});
        const dispatch = jest.fn();
        const rService = new MockRService();

        render(<AppContext.Provider value={{dispatch, state, rService}}>
            <CanvasPlot plot={null} title={"test title"}
                        error={""}/></AppContext.Provider>);
        expect(screen.getByRole("loader")).not.toBeNull();
        expect(screen.queryByTestId("test title")).toBe(null);
        expect(screen.getByText("Generating plot")).not.toBeNull();
    });

    it("renders generic error message if error is present", () => {
        render(<CanvasPlot plot={null} title={"test title"}
                           error={"some error"}/>);
        expect(screen.queryByRole("loader")).toBeNull();
        expect(screen.queryByTestId("test title")).toBe(null);
        expect(screen.getByText("Plot could not be rendered")).not.toBeNull();
    });

    it("renders plot if plot is not null", () => {
        render(<CanvasPlot plot={new ImageBitmap()}
                           title={"test title"}
                           error={""}/>);
        expect(screen.queryByRole("loader")).toBeNull();
        expect(screen.queryByTestId("test title")).not.toBe(null);
    });

    it("clears previous canvas if plot or title change", async () => {
        const plot = await mockImageBitmap(50, 50)
        const view = render(<CanvasPlot plot={plot}
                                        title={"test title"}
                                        error={""}/>);
        expect(screen.queryByRole("loader")).toBeNull();
        expect(screen.queryByTestId("test title")).not.toBe(null);
        // eslint-disable-next-line testing-library/no-node-access
        expect(((screen.getByTestId("test title").firstChild as Node).firstChild as HTMLCanvasElement).height)
            .toBe(50);

        const newPlot = await mockImageBitmap(100, 100)
        view.rerender(<CanvasPlot plot={newPlot}
                                  title={"test title"}
                                  error={""}/>);

        // eslint-disable-next-line testing-library/no-node-access
        expect((screen.getByTestId("test title").firstChild as Node).childNodes.length)
            .toBe(1);
        // eslint-disable-next-line testing-library/no-node-access
        expect(((screen.getByTestId("test title").firstChild as Node).firstChild as HTMLCanvasElement).height)
            .toBe(100);

        view.rerender(<CanvasPlot plot={newPlot}
                                  title={"new title"}
                                  error={""}/>);

        // eslint-disable-next-line testing-library/no-node-access
        expect((screen.getByTestId("new title").firstChild as Node).childNodes.length)
            .toBe(1);
    });

})
