import React, {useState, useEffect, useMemo} from "react";
import {RContext} from "../RContext";
import {DataService} from "../services/dataService";
import {Demography} from "./Demography";
import {Col, Container, Row} from "react-bootstrap";

const App = () => {

    const dataService = useMemo(() => new DataService(), []);
    const [ready, setReady] = useState(false);

    useEffect(() => {
        dataService
            .init().then(() => {
            setReady(true)
        });
    }, [dataService]);

    if (!ready) return null

    return (
        <RContext.Provider value={dataService}>
            <Container fluid>
                <Row>
                    <Col>
                        <Demography/>
                    </Col>
                </Row>
            </Container>
        </RContext.Provider>
    );
};

export default App;
