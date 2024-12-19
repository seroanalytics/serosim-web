import React, {useState, useContext} from "react";
import {ActionType, DispatchContext, RContext} from "../contexts";
import {PlotlyPlot} from "./PlotlyPlot";
import {Col, Form, Row} from "react-bootstrap";
import {useDebouncedEffect} from "../hooks/useDebouncedEffect";
import {ScaleLoader} from "react-spinners";
import InlineFormControl from "./InlineFormControl";

export function Demography() {

    const [N, setN] = useState<number>(100);
    const [maxTime, setMaxTime] = useState<number>(100);
    const [pRemoval, setpRemoval] = useState<number>(1);
    const [plot, setPlot] = useState<any>(null);
    const [loading, setLoading] = useState<boolean>(true);

    const rService = useContext(RContext);
    const dispatch = useContext(DispatchContext);


    useDebouncedEffect(() => {
        const runRCode = async () => {
            setLoading(true);
            try {
                const demography = await rService.getDemography(N);
                // const result = await rService.getDemographyPlot(demography);
                // setPlot(result);
                dispatch({
                    type: ActionType.ADD_DEMOGRAPHY,
                    payload: demography
                })
            } catch (error) {
                console.log(error)
                dispatch({
                    type: ActionType.ERROR_ADDED,
                    payload: "Error executing R code: " + error
                });
                setPlot(null);
            }
            setLoading(false);
        };

        runRCode();

    }, [dispatch, rService, N], 500);

    return (<Row><Col className={"pt-5"}>
            <h4>1. Define demography</h4>
            <Row className={"mt-3"}>
                <Col sm={4}>
                    <Form className={"pt-4 border px-2"}>
                        <InlineFormControl value={N} handleChange={setN}
                                           label={"Number of individuals"}/>
                        <InlineFormControl value={maxTime}
                                           handleChange={setMaxTime}
                                           label={"Max time"}/>
                        <InlineFormControl value={pRemoval}
                                           handleChange={setpRemoval}
                                           label={"Probability of removal"}/>
                    </Form>
                </Col>
                <Col>
                    <div className={"border"}>
                        {loading ? (
                            <div className={"py-5 text-center"}>
                                <ScaleLoader/>
                            </div>
                        ) : (<div></div>)}
                    </div>
                </Col>
            </Row>
        </Col></Row>
    );
}

// (<PlotlyPlot plot={plot}/>)}
