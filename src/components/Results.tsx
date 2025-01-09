import {Button, Col, Row} from "react-bootstrap";
import React, {useContext, useState} from "react";
import {PlotlyPlot} from "./PlotlyPlot";
import {RContext, StateContext} from "../contexts";
import {PlotlyProps} from "../types";
import SectionError from "./SectionError";
import RunSerosim from "./RunSerosim";
import {DownloadCloudIcon} from "lucide-react";
import {useAsyncEffectSafely} from "../hooks/useAsyncEffectSafely";
import {ScaleLoader} from "react-spinners";

export default function Results() {
    const state = useContext(StateContext)
    const rService = useContext(RContext)

    const [kinetics, setKinetics] = useState<PlotlyProps | null>(null)
    const [quantity, setQuantity] = useState<PlotlyProps | null>(null)
    const [downloading, setDownloading] = useState<boolean>(false);

    const kineticsError = useAsyncEffectSafely(async () => {

        const getPlot = async () => {
            setKinetics(null)
            const kinetics = await rService.getIndividualKinetics(state.demography.rObj!!, state.result);
            setKinetics(kinetics)
        }

        if (state.result) {
            await getPlot()
        }

    }, [rService, state.demography, state.result]);

    const quantityError = useAsyncEffectSafely(async () => {

        const getPlot = async () => {
            setQuantity(null)
            const quantity = await rService.getBiomarkerQuantity(state.result);
            setQuantity(quantity)
        }

        if (state.result) {
            await getPlot()
        }

    }, [rService, state.demography, state.result]);

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
                                     onClick={downloadResults}
                                     variant={"secondary"}
                                     disabled={downloading}>
                <DownloadCloudIcon/> Download
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
