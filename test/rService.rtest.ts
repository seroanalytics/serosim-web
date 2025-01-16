import {WebRService} from "../src/services/RService";
import {WebRDataJsNode} from "webr/dist/webR/robj";
import {mockKineticsModel} from "./mocks";

describe("WebRService", () => {

    const rService = new WebRService();
    beforeAll(async () => {
        await rService.init();
    }, 1000 * 60 * 60);

    it("can generate demography", async () => {
        const result = await rService.getDemography(2, 2, 0) as WebRDataJsNode;
        expect(result.type).toBe("list");
        expect(result.names).toEqual(["i", "birth", "removal", "times"]);
        expect(result.values[0]).toEqual(
            {names: null, type: "integer", values: [1, 1, 2, 2]});
        expect(result.values[1]).toEqual(
            {names: null, type: "double", values: [1, 1, 1, 1]});
        expect(result.values[2]).toEqual(
            {names: null, type: "double", values: [3, 3, 3, 3]}); // with p=0 removals are after tmax
        expect(result.values[3]).toEqual(
            {names: null, type: "integer", values: [1, 2, 1, 2]});

    });

    it("can generate demography plot", async () => {
        const demography = {
            type: "list",
            names: ["i", "birth", "removal", "times"],
            values: [
                {names: null, type: "integer", values: [1, 1, 2, 2]},
                {names: null, type: "double", values: [1, 1, 1, 1]},
                {names: null, type: "double", values: [1, 1, 1, 1]},
                {names: null, type: "integer", values: [1, 2, 1, 2]}
            ]
        }
        const result = await rService.getDemographyPlot(demography as WebRDataJsNode);
        expect(result.data.length).toBe(1);
        expect(result.layout.xaxis).not.toBeNull();
    });

    it("can generate kinetics plot with biphasic antibody model", async () => {
        const spy = jest.spyOn(rService, "_generatePlot" as any);
        const result = await rService.getKineticsPlot("biphasic", [{exposureType: "vax"}] as any, {"vax": mockKineticsModel()}, 2, 5);
        expect(result.data.length).toBe(2);
        expect(result.layout.xaxis).not.toBeNull();
        expect(spy.mock.calls[0][0]).toMatch("serosim::plot_antibody_model(serosim::antibody_model_biphasic, N=2,times=seq(1,5,by=1)");
    });

    it("can generate kinetics plot with monophasic antibody model", async () => {
        const spy = jest.spyOn(rService, "_generatePlot" as any);
        const result = await rService.getKineticsPlot("monophasic", [{exposureType: "vax"}] as any, {"vax": mockKineticsModel()}, 2, 5);
        expect(result.data.length).toBe(2);
        expect(result.layout.xaxis).not.toBeNull();
        expect(spy.mock.calls[0][0]).toMatch("serosim::plot_antibody_model(serosim::antibody_model_monophasic, N=2,times=seq(1,5,by=1)");
    });

    it("can generate sero output as csv", async () => {
        const result = {
            type: "list",
            names: ["observed_biomarker_states"],
            values: [
                {
                    type: "list",
                    names: ["id", "t", "b", "i", "value", "observed"],
                    values: [
                        {
                            type: "integer", names: null, values: [1, 1]
                        },
                        {
                            type: "integer", names: null, values: [1, 2]
                        },
                        {
                            type: "double", names: null, values: [1, 1]
                        },
                        {
                            type: "integer", names: null, values: [1, 1]
                        },
                        {
                            type: "double", names: null, values: [1.1, 1.2]
                        },
                        {
                            type: "double", names: null, values: [1, 1]
                        }
                    ]
                }
            ]
        }
        const output = await rService.getSeroOutput(result as WebRDataJsNode);
        const lines = output.split("\n")
        expect(lines[0]).toBe("\"id\",\"day\",\"biomarker\",\"i\",\"value\",\"observed\"");
        expect(lines[1]).toBe("1,1,1,1,1.1,1");
        expect(lines[2]).toBe("1,2,1,1,1.2,1");
    })

    it("can generate exposure histories output as csv", async () => {
        const result = {
            type: "list",
            names: ["immune_histories_long"],
            values: [
                {
                    type: "list",
                    names: ["i", "t", "x", "value"],
                    values: [
                        {
                            type: "integer", names: null, values: [1, 1]
                        },
                        {
                            type: "integer", names: null, values: [1, 2]
                        },
                        {
                            type: "integer", names: null, values: [1, 2]
                        },
                        {
                            type: "double", names: null, values: [0, 1]
                        }
                    ]
                }
            ]
        }
        const output = await rService.getExposuresOutput(result as WebRDataJsNode);
        const lines = output.split("\n")
        expect(lines[0]).toBe("\"id\",\"day\",\"exposure\",\"value\"");
        expect(lines[1]).toBe("1,1,1,0");
        expect(lines[2]).toBe("1,2,2,1");
    })

    afterAll(() => {
        rService.close()
    })
});
