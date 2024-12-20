import {generatePopDemography} from "../src/services/DemographyService";
import {RService} from "../src/services/RService";
import * as fs from "node:fs";

describe("demo", () => {

    it("generates demo", async () => {
        // const rService = new RService();
        // await rService.init()
        const result = generatePopDemography(100, [...Array(10)].map((x, i) => i), new Array(100).fill(1), 0, 1, 100, 1, null)
        // const rResult = await rService.getDemography(100)
        // expect(result).toEqual(rResult.toJs());
        const stream = fs.createWriteStream('./test.json');
        stream.write(JSON.stringify(result));
    }, 100000000000000)


})
