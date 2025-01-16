import {Button, Col, Row} from "react-bootstrap";
import React, {useState} from "react";
import {PlotlyPlot} from "./PlotlyPlot";
import SectionError from "./SectionError";
import RunSerosim from "./RunSerosim";
import {DownloadCloudIcon} from "lucide-react";
import {ScaleLoader} from "react-spinners";
import {useAppContext} from "../services/AppContextProvider";
import {usePlot} from "../hooks/usePlot";

export default function Results() {
    const {state, rService} = useAppContext();
    const [downloading, setDownloading] = useState<boolean>(false);

    const [kinetics, kineticsError] = usePlot("getIndividualKinetics",
        () => !!state.result,
        async () => {
            return await rService.getIndividualKinetics(state.demography.rObj!!, state.result);
        },
        [rService, state.demography, state.result], 0);

    const [quantity, quantityError] = usePlot("getBiomarkerQuantity",
        () => !!state.result,
        async () => await rService.getBiomarkerQuantity(state.result),
        [rService, state.demography, state.result], 0);

    const downloadResults = async () => {
        setDownloading(true);
        try {
            const result = await rService.getResultsJson(state.result);
            let type = "application/json", name = "serosim.json";
            downloader(result, type, name)
        } finally {
            setDownloading(false)
        }
    }

    const downloadSerology = async () => {
        setDownloading(true);
        try {
            const result = await rService.getSeroOutput(state.result, state.biomarker);
            let type = "text/csv", name = "sero.csv";
            downloader(result, type, name)
        } finally {
            setDownloading(false)
        }
    }

    const downloadExposures = async () => {
        setDownloading(true);
        try {
            const result = await rService.getExposuresOutput(state.result, state.exposureTypes);
            let type = "text/csv", name = "exposures.csv";
            downloader(result, type, name)
        } finally {
            setDownloading(false)
        }
    }

    function downloadURI(uri: any, name: any) {
        let link = document.createElement("a");
        link.download = name;
        link.href = uri;
        link.click();
    }

    function downloader(data: any, type: any, name: any) {
        let blob = new Blob([data], {type});
        let url = window.URL.createObjectURL(blob);
        downloadURI(url, name);
        window.URL.revokeObjectURL(url);
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
                <DownloadCloudIcon/> Download all
            </Button>}
            <Row className={"mt-3"}>
                <Col>
                    <SectionError error={kineticsError}/>
                    {state.result &&
                        <PlotlyPlot plot={kinetics}
                                    hasTitle={true}
                                    error={kineticsError}/>}
                </Col>
                <Col>
                    <SectionError error={quantityError}/>
                    {state.result &&
                        <PlotlyPlot plot={quantity}
                                    hasTitle={true}
                                    error={quantityError}/>}
                </Col>
            </Row>
        </Col>
    </Row>
}
