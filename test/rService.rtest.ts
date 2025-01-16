import {WebRService} from "../src/services/RService";
import {WebRDataJsNode} from "webr/dist/webR/robj";
import {
    mockAppState,
    mockExposureType, mockImmunityModel,
    mockKineticsModel,
    mockObsModel
} from "./mocks";

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

    it("can generate observation plot", async () => {
        const result = await rService.getObservationTimesPlot(1, 10, 10);
        expect(result.data.length).toBe(1);
        expect(result.layout.xaxis).not.toBeNull();
    });

    it("generates correct model parameters", async () => {
        const result = rService.getModelPars(mockAppState(
            {
                exposureTypes: [
                    mockExposureType({exposureType: "Vax"}),
                    mockExposureType({exposureType: "Delta"})
                ],
                kinetics: {
                    "Vax": mockKineticsModel({
                        wane: 3,
                        boost: 4
                    }),
                    "Delta": mockKineticsModel({
                        wane: 1,
                        boost: 1
                    })
                },
                observationalModel: mockObsModel({
                    error: 0.1,
                    upperBound: 10,
                    type: "bounded",
                    numBleeds: 1
                }),
                kineticsFunction: "monophasic",
                immunityModel: mockImmunityModel({
                    variance: 1,
                    max: 14,
                    midpoint: 7
                })
            }
        ));
        expect(result.length).toBe(9)
        expect(result).toEqual([
            {
                biomarker_id: 1,
                distribution: null,
                exposure_id: 1,
                mean: 4,
                name: "boost",
                sd: null
            },
            {
                biomarker_id: 1,
                distribution: null,
                exposure_id: 1,
                mean: 3,
                name: "wane",
                sd: null
            },
            {
                biomarker_id: 1,
                distribution: null,
                exposure_id: 2,
                mean: 1,
                name: "boost",
                sd: null
            },
            {
                biomarker_id: 1,
                distribution: null,
                exposure_id: 2,
                mean: 1,
                name: "wane",
                sd: null
            },
            {
                biomarker_id: 1,
                distribution: null,
                exposure_id: 1,
                mean: 7,
                name: "biomarker_prot_midpoint",
                sd: null
            },
            {
                biomarker_id: 1,
                distribution: null,
                exposure_id: 1,
                mean: 1,
                name: "biomarker_prot_width",
                sd: null
            },
            {
                biomarker_id: 1,
                distribution: null,
                exposure_id: 2,
                mean: 7,
                name: "biomarker_prot_midpoint",
                sd: null
            },
            {
                biomarker_id: 1,
                distribution: null,
                exposure_id: 2,
                mean: 1,
                name: "biomarker_prot_width",
                sd: null
            },
            {
                biomarker_id: 1,
                distribution: "normal",
                exposure_id: null,
                mean: null,
                name: "obs_sd",
                sd: 0.1
            },
        ])
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
                            type: "integer", names: null, values: [12, 17]
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
                            type: "double", names: null, values: [20, 21]
                        },
                        {
                            type: "double", names: null, values: [19.5, 21.2]
                        }
                    ]
                }
            ]
        }
        const output = await rService.getSeroOutput(result as WebRDataJsNode, "IgG");
        const lines = output.split("\n")
        expect(lines[0]).toBe("\"id\",\"day\",\"biomarker\",\"value\"");
        expect(lines[1]).toBe("1,1,\"IgG\",19.5");
        expect(lines[2]).toBe("1,2,\"IgG\",21.2");
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
        const output = await rService.getExposuresOutput(result as WebRDataJsNode, [{exposureType: "vax"}, {exposureType: "delta"}] as any);
        const lines = output.split("\n")
        expect(lines[0]).toBe("\"id\",\"day\",\"exposure\",\"value\"");
        expect(lines[1]).toBe("1,1,\"vax\",0");
        expect(lines[2]).toBe("1,2,\"delta\",1");
    });

    afterAll(() => {
        rService.close()
    })
});
