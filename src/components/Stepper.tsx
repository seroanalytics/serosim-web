import {Col, Row} from "react-bootstrap";
import {Step} from "../types";
import {useAppContext} from "../services/AppContextProvider";

function StepButton({name, num, complete, ready}: Step) {
    let className = "btn rounded-circle";

    const {state} = useAppContext();

    const isReady = ready(state)
    if (complete(state)) {
        className += " btn-primary"
    } else if (isReady) {
        className += " btn-outline-primary"
    } else {
        className += " btn-light"
    }
    return <Col className={"step"}>
        <button
            disabled={!isReady}
            className={className}>
            {num}
        </button>
        <div className="text-center mt-3">{name}</div>
    </Col>
}

export default function Stepper() {
    const {state} = useAppContext();
    return <Row id="stepper" className={"my-5"}>
        {state.steps.map(step => {
            const components = [
                <StepButton key={step.num} num={step.num}
                            complete={step.complete}
                            name={step.name}
                            ready={step.ready}></StepButton>]
            if (step.num < state.steps.length) {
                components.push(<Col className="step-connector mt-2" key={"col"}>
                    <hr/>
                </Col>)
            }
            return components
        })}
    </Row>
}
