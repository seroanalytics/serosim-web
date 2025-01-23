import {Button, Col, Row} from "react-bootstrap";
import React, {useState} from "react";
import SectionError from "./SectionError";
import RunSerosim from "./RunSerosim";
import {DownloadCloudIcon} from "lucide-react";
import {ScaleLoader} from "react-spinners";
import {useAppContext} from "../services/AppContextProvider";
import {usePlot} from "../hooks/usePlot";
import {CanvasPlot} from "./CanvasPlot";
import {
    downloadData,
    createZipUri,
    downloadUri
} from "../services/downloadUtils";

export default function Results() {
    const {state, rService} = useAppContext();
    const [downloading, setDownloading] = useState<boolean>(false);

    const [kinetics, kineticsError] = usePlot("getIndividualKinetics",
        () => !!state.result,
        async () => {
            return await rService.getIndividualKineticsPlot(state.demography.rObj!!, state.result, state.demography.numIndividuals);
        },
        [rService, state.demography, state.result], 0)

    const [quantity, quantityError] = usePlot("getBiomarkerQuantity",
        () => !!state.result,
        async () => await rService.getBiomarkerQuantityPlot(state.result),
        [rService, state.result], 0)

    const [history, historyError] = usePlot("getImmuneHistories",
        () => !!state.result,
        async () => await rService.getImmuneHistoriesPlot(state.result),
        [rService, state.result], 0)

    const downloadResults = async () => {
        setDownloading(true);
        try {
            const result = await rService.getResultsJson(state.result);
            let type = "application/json", name = "serosim.json";
            downloadData(result, type, name)
        } finally {
            setDownloading(false)
        }
    }

    const downloadSerology = async () => {
        setDownloading(true);
        try {
            const result = await rService.getSeroOutputCSV(state.result, state.biomarker);
            const type = "text/csv", name = "sero.csv";
            downloadData(result, type, name)
        } finally {
            setDownloading(false)
        }
    }

    const downloadExposures = async () => {
        setDownloading(true);
        try {
            const result = await rService.getExposuresOutputCSV(state.result, state.exposureTypes);
            const type = "text/csv", name = "exposures.csv";
            downloadData(result, type, name)
        } finally {
            setDownloading(false)
        }
    }


    const downloadPlots = async () => {
        setDownloading(true);
        try {
            const images = [quantity, history, kinetics]
                .filter(img => !!img) as ImageBitmap[]
            const uri = await createZipUri(images)
            downloadUri(uri, "serosim-plots.zip")
        } finally {
            setDownloading(false)
        }
    }

    if (!state.steps[5].ready(state)) {
        return null
    }

    return <Row>
        <Col className={"pt-5"}>
            <h4>6. Generate dataset</h4>
            <RunSerosim/>
            {downloading && <ScaleLoader/>}
            {state.result && <Button size={"lg"}
                                     className={"me-2"}
                                     onClick={downloadSerology}
                                     variant={"secondary"}
                                     disabled={downloading}>
                <DownloadCloudIcon/> Download serology
            </Button>}
            {state.result && <Button size={"lg"}
                                     className={"me-2"}
                                     onClick={downloadExposures}
                                     variant={"secondary"}
                                     disabled={downloading}>
                <DownloadCloudIcon/> Download exposures
            </Button>}
            {state.result && <Button size={"lg"}
                                     className={"me-2"}
                                     onClick={downloadResults}
                                     variant={"secondary"}
                                     disabled={downloading}>
                <DownloadCloudIcon/> Download all serosim output
            </Button>}
            {state.result && <Button size={"lg"}
                                     className={"me-2"}
                                     onClick={downloadPlots}
                                     variant={"secondary"}
                                     disabled={downloading || !history || !quantity || !kinetics}>
                <DownloadCloudIcon/> Download output plots
            </Button>}
            <Row className={"mt-3"}>
                <div id={"plot-output"}></div>
                <Col>
                    <SectionError error={kineticsError}/>
                    {state.result &&
                        <CanvasPlot plot={kinetics}
                                    title={"individual-biomarker-kinetics"}
                                    error={kineticsError}/>}
                </Col>
                <Col>
                    <SectionError error={quantityError}/>
                    {state.result &&
                        <CanvasPlot plot={quantity}
                                    title={"true-biomarker-quantity"}
                                    error={quantityError}/>}
                </Col>
            </Row>
            <Row className={"mt-2"}>
                <Col>
                    <SectionError error={historyError}/>
                    {state.result &&
                        <CanvasPlot plot={history}
                                    title={"individual-immune-history"}
                                    error={historyError}/>}
                </Col>
                <Col></Col>
            </Row>
        </Col>
    </Row>
}
