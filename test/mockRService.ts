import {RService} from "../src/services/RService";

export class MockRService implements RService {
    getExposuresOutputCSV = jest.fn()
    getSeroOutputCSV = jest.fn()
    runSerosim = jest.fn()
    getKineticsPlot = jest.fn()
    getDemography = jest.fn()
    getDemographyPlot = jest.fn()
    getImmunityPlot = jest.fn()
    getObservationTimesPlot = jest.fn()
    getBiomarkerQuantityPlot = jest.fn()
    getImmuneHistoriesPlot = jest.fn()
    getIndividualKineticsPlot = jest.fn()
    getResultsJson = jest.fn()
}
