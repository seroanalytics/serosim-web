import React from "react";
import {render, screen} from "@testing-library/react";
import App from "../src/components/App";

describe("<App />", () => {

    it("will render",async () => {
        render(<App/>);
        const errors = await screen.findAllByRole("alert");
        expect(errors.length).toBe(2);
    });

    afterAll(() => {

    })
})
