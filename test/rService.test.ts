import {WebRService} from "../src/services/RService";
import {WebR} from "webr";
import Mock = jest.Mock;
import {
    mockAppState,
    mockExposureType, mockImmunityModel,
    mockKineticsModel,
    mockObsModel
} from "./mocks";
import {MockWebR} from "./mockWebR";

jest.mock('webr');

describe("WebRService", () => {

    beforeEach(() => {
        (WebR as Mock).mockClear()
    })

    const mockWebR = new MockWebR() as unknown as WebR
    const rService = new WebRService(mockWebR);
    rService.init()

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

    it("uses numIndividuals as upper bound for subset", async () => {
        const spy = jest.spyOn(rService, "_generateBitmapImage" as any);
        await rService.getIndividualKineticsPlot({} as any, {} as any, 7)
        expect(spy.mock.calls[0][0]).toMatch("subset = 7")

        await rService.getIndividualKineticsPlot({} as any, {} as any, 100)
        expect(spy.mock.calls[1][0]).toMatch("subset = 10")
    });

});
