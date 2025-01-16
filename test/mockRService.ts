import {RService} from "../src/services/RService";

export class MockRService implements RService {
    getExposuresOutput = jest.fn()
    getSeroOutput = jest.fn()
    runSerosim = jest.fn()
    getKineticsPlot = jest.fn()
    getDemography = jest.fn()
    getDemographyPlot = jest.fn()
    getImmunityPlot = jest.fn()
    getObservationTimesPlot = jest.fn()
    getBiomarkerQuantity = jest.fn()
    getIndividualKinetics = jest.fn()
    getResultsJson = jest.fn()
}
