import {render, screen} from "@testing-library/react";
import InlineFormControl from "../src/components/InlineFormControl";
import React from "react";
import {userEvent} from "@testing-library/user-event";

describe("<InlineFormControl/>", () => {

    it("parses values as floats by default", async () => {
        const handler = jest.fn();

        render(<InlineFormControl value={1}
                                  handleChange={handler}
                                  label={"Test"}/>);

        const input = screen.getByRole("spinbutton");
        await userEvent.type(input, ".2");
        expect(handler.mock.calls[0][0]).toBe(1.2);
    });

    it("parses values as ints if specified", async () => {
        const handler = jest.fn();

        render(<InlineFormControl value={1}
                                  handleChange={handler}
                                  type={"int"}
                                  label={"Test"}/>);

        const input = screen.getByRole("spinbutton");
        await userEvent.type(input, ".2");
        expect(handler.mock.calls[0][0]).toBe(1);
    });

    it("parses values as strings if specified", async () => {
        const handler = jest.fn();

        render(<InlineFormControl value={""}
                                  handleChange={handler}
                                  type={"string"}
                                  label={"Test"}/>);

        const input = screen.getByRole("textbox");
        await userEvent.type(input, "T");
        expect(handler.mock.calls[0][0]).toBe("T");
    });

    it("renders NaNs as empty strings", async () => {
        const handler = jest.fn();

        render(<InlineFormControl value={NaN}
                                  handleChange={handler}
                                  label={"Test"}/>);

        const input = screen.getByRole("spinbutton") as HTMLInputElement;
        expect(input.value).toBe("")
    });

    it("renders zeros", async () => {
        const handler = jest.fn();

        render(<InlineFormControl value={0}
                                  handleChange={handler}
                                  label={"Test"}/>);

        const input = screen.getByRole("spinbutton") as HTMLInputElement;
        expect(input.value).toBe("0")
    });

    it("renders non-zero values", async () => {
        const handler = jest.fn();

        render(<InlineFormControl value={3}
                                  handleChange={handler}
                                  label={"Test"}/>);

        const input = screen.getByRole("spinbutton") as HTMLInputElement;
        expect(input.value).toBe("3")
    });

});
