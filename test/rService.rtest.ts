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
        const result = await rService.getKineticsPlot([{exposureType: "vax"}] as any, {"vax": mockKineticsModel()}, 2, 5);
        expect(result.data.length).toBe(2);
        expect(result.layout.xaxis).not.toBeNull();
        expect(spy.mock.calls[0][0]).toMatch("serosim::plot_antibody_model(serosim::antibody_model_biphasic, N=2,times=seq(1,5,by=1)");
    });

    afterAll(() => {
        rService.close()
    })
});
