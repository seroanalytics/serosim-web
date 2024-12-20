import {Col, Row} from "react-bootstrap";
import React, {useContext, useEffect, useState} from "react";
import {PlotlyPlot} from "./PlotlyPlot";
import {RContext, StateContext} from "../contexts";
import {PlotlyProps} from "../types";
import SectionError from "./SectionError";

export default function Results() {
    const state = useContext(StateContext)
    const rService = useContext(RContext)

    const [kinetics, setKinetics] = useState<PlotlyProps | null>(null)
    const [quantity, setQuantity] = useState<PlotlyProps | null>(null)
    const [histories, setHistories] = useState<PlotlyProps | null>(null)

    useEffect(() => {

        const getPlot = async () => {
            try {
                setKinetics(null)
                const kinetics = await rService.getIndividualKinetics(state.demography.rObj, state.result);
                setKinetics(kinetics)
                console.log("SET KINETICS")

            } catch (error) {
                console.log(error)
            }
        }

        if (state.result) {
            getPlot()
        }

    }, [rService, state.demography, state.result]);

    useEffect(() => {

        const getPlot = async () => {
            try {
                setQuantity(null)
                const quantity = await rService.getBiomarkerQuantity(state.result);
                setQuantity(quantity)
                console.log("SET QUANTITY")

            } catch (error) {
                console.log(error)
            }
        }

        if (state.result) {
            getPlot()
        }

    }, [rService, state.demography, state.result]);

    // useEffect(() => {
    //
    //     const getPlot = async () => {
    //         try {
    //             setHistories(null)
    //             const histories = await rService.getImmuneHistories(state.result);
    //             setHistories(histories)
    //             console.log("SET HISTORIES")
    //
    //         } catch (error) {
    //             console.log(error)
    //         }
    //     }
    //
    //     if (state.result) {
    //         getPlot()
    //     }
    //
    // }, [rService, state.demography, state.result]);

    return <Row>
        <Col className={"pt-5"}>
            <h4>6. Visualise simulated dataset</h4>
           {/*// <SectionError error={demoError}/>*/}
            <Row className={"mt-3"}>
                <Col>
                    <PlotlyPlot plot={kinetics}/>
                </Col>
            </Row>
            <Row className={"mt-3"}>
                <Col>
                    <PlotlyPlot plot={quantity}/>
                </Col>
            </Row>
        </Col>
    </Row>
}
