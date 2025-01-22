import {WebRService} from "../src/services/RService";
import {WebRDataJs, WebRDataJsNode} from "webr/dist/webR/robj";
import {mockKineticsModel} from "./mocks";
import {WebR} from "webr";

describe("WebRService integration", () => {

    const webR = new WebR();
    const rService = new WebRService(webR);

    const mockResult: WebRDataJsNode =        {
        type: "list",
        names: ["biomarker_states", "observed_biomarker_states", "immune_histories_long"],
        values: [
            {
                type: "list",
                names: ["t", "b", "i", "value"],
                values: [
                    {
                        type: "integer", names: null, values: [1, 2, 1, 2]
                    },
                    {
                        type: "double", names: null, values: [1, 1, 1, 1]
                    },
                    {
                        type: "integer", names: null, values: [1, 1, 2, 2]
                    },
                    {
                        type: "double", names: null, values: [20, 21, 19, 18]
                    }
                ]
            },
            {
                type: "list",
                names: ["id", "t", "b", "i", "value", "observed"],
                values: [
                    {
                        type: "integer", names: null, values: [12, 17, 13, 14]
                    },
                    {
                        type: "integer", names: null, values: [1, 2, 1, 2]
                    },
                    {
                        type: "double", names: null, values: [1, 1, 1, 1]
                    },
                    {
                        type: "integer", names: null, values: [1, 1, 2, 2]
                    },
                    {
                        type: "double", names: null, values: [20, 21, 19, 18]
                    },
                    {
                        type: "double", names: null, values: [19.5, 21.2, 19.2, 18.2]
                    }
                ]
            },
            {
                type: "list",
                names: ["i", "t", "x", "value"],
                values: [
                    {
                        type: "integer", names: null, values: [1, 1, 2, 2]
                    },
                    {
                        type: "integer", names: null, values: [1, 2, 1, 2]
                    },
                    {
                        type: "integer", names: null, values: [1, 2, 1, 2]
                    },
                    {
                        type: "double", names: null, values: [0, 1, 0, 1]
                    }
                ]
            }
        ]
    }

    const mockDemography: WebRDataJs = {
        type: "list",
        names: ["i", "birth", "removal", "times"],
        values: [
            {names: null, type: "integer", values: [1, 1, 2, 2]},
            {names: null, type: "double", values: [1, 1, 1, 1]},
            {names: null, type: "double", values: [1, 1, 1, 1]},
            {names: null, type: "integer", values: [1, 2, 1, 2]}
        ]
    }

    beforeAll(async () => {
        // mock OffscreenCanvas for capturing graphics
        await webR.evalRVoid(`
      webr::eval_js("
        class ImageData {
         constructor() {}
        };
        class OffscreenCanvas {
          constructor() {}
          width = 10
          height = 10
          getContext() {
            return {
              putImageData: () => {},
              drawImage: () => {},
              scale: () => {},
              arc: () => {},
              beginPath: () => {},
              clearRect: () => {},
              clip: () => {},
              getImageData: () => {},
              setLineDash: () => {},
              rect: () => {},
              restore: () => {},
              save: () => {},
              stroke: () => {},
              fillRect: () => {},
              strokeRect: () => {},
              moveTo: () => {},
              lineTo: () => {},
              fillText: () => {},
              fill: () => {},
              translate: () => {},
              rotate: () => {},
              measureText: () => {
                  return {                  
                    actualBoundingBoxAscent: 1,
                    actualBoundingBoxDescent: 1,
                    actualBoundingBoxLeft: 1,
                    actualBoundingBoxRight: 1,
                    fontBoundingBoxAscent: 1,
                    fontBoundingBoxDescent: 1,
                    width: 1
                   }
               }
            };
          }
          transferToImageBitmap() {
            return {
                width: 10,
                height: 10
            }
          }
        }
        globalThis.OffscreenCanvas = OffscreenCanvas;
        globalThis.ImageData = ImageData;
        undefined;
      ")
    `);
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
        const result = await rService.getDemographyPlot(mockDemography);
        expect(result.width).toBe(10);
        expect(result.height).toBe(10);
    });

    it("can generate observation plot", async () => {
        const result = await rService.getObservationTimesPlot(1, 10, 10);
        expect(result.width).toBe(10);
        expect(result.height).toBe(10);
    });

    it("can generate antibody kinetics plot with biphasic antibody model", async () => {
        const spy = jest.spyOn(rService, "_generateBitmapImage" as any);
        const result = await rService.getKineticsPlot("biphasic", [{exposureType: "vax"}] as any, {"vax": mockKineticsModel()}, 2, 5);
        expect(result.width).toBe(10);
        expect(result.height).toBe(10);
        expect(spy.mock.calls[0][0]).toMatch("serosim::plot_antibody_model(serosim::antibody_model_biphasic, N=2,times=seq(1,5,by=1)");
    });

    it("can generate antibody kinetics plot with monophasic antibody model", async () => {
        const spy = jest.spyOn(rService, "_generateBitmapImage" as any);
        const result = await rService.getKineticsPlot("monophasic", [{exposureType: "vax"}] as any, {"vax": mockKineticsModel()}, 2, 5);
        expect(result.width).toBe(10);
        expect(result.height).toBe(10);
        expect(spy.mock.calls[0][0]).toMatch("serosim::plot_antibody_model(serosim::antibody_model_monophasic, N=2,times=seq(1,5,by=1)");
    });

    it("can generate observation times plot", async () => {
        const result = await rService.getObservationTimesPlot(1, 10, 50);
        expect(result.width).toBe(10);
        expect(result.height).toBe(10);
    });

    it("can generate biomarker quantities plot", async () => {
        const spy = jest.spyOn(rService, "_generateBitmapImage" as any);
        const result = await rService.getBiomarkerQuantityPlot(mockResult);
        expect(result.width).toBe(10);
        expect(result.height).toBe(10);
        expect(spy.mock.calls[0][0]).toMatch("serosim::plot_biomarker_quantity(as.data.frame(result$biomarker_states))");
    });

    it("can generate immune histories plot", async () => {
        const spy = jest.spyOn(rService, "_generateBitmapImage" as any);
        const result = await rService.getImmuneHistoriesPlot(mockResult);
        expect(result.width).toBe(10);
        expect(result.height).toBe(10);
        expect(spy.mock.calls[0][0]).toMatch("serosim::plot_immune_histories(as.data.frame(result$immune_histories_long))");
    });

    it("can generate individual kinetics plot", async () => {
        const spy = jest.spyOn(rService, "_generateBitmapImage" as any);
        const result = await rService.getIndividualKineticsPlot(mockDemography, mockResult, 2);
        expect(result.width).toBe(10);
        expect(result.height).toBe(10);
        expect(spy.mock.calls[0][0]).toMatch("serosim::plot_subset_individuals_history");
    });

    it("can generate sero output as csv", async () => {
        const output = await rService.getSeroOutputCSV(mockResult, "IgG");
        const lines = output.split("\n")
        expect(lines[0]).toBe("\"id\",\"day\",\"biomarker\",\"value\"");
        expect(lines[1]).toBe("1,1,\"IgG\",19.5");
        expect(lines[2]).toBe("1,2,\"IgG\",21.2");
    })

    it("can generate exposure histories output as csv", async () => {
        const output = await rService.getExposuresOutputCSV(mockResult, [{exposureType: "vax"}, {exposureType: "delta"}] as any);
        const lines = output.split("\n")
        expect(lines[0]).toBe("\"id\",\"day\",\"exposure\",\"value\"");
        expect(lines[1]).toBe("1,1,\"vax\",0");
        expect(lines[2]).toBe("1,2,\"delta\",1");
    });

    afterAll(() => {
        rService.close()
    })
});
