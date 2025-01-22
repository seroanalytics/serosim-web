import {useEffect, useState} from "react";
import {Dict} from "../types";

class RunningOperationCounter {
    private _runningOperationCounter: Dict<number> = {}

    increment(name: string) {
        if (this._runningOperationCounter[name] === undefined) {
            this._runningOperationCounter[name] = 0
        }
        this._runningOperationCounter[name] = this._runningOperationCounter[name] + 1
    }

    decrement(name: string) {
        this._runningOperationCounter[name] = this._runningOperationCounter[name] - 1
    }

    isRunning(name: string) {
        return this._runningOperationCounter[name] > 0
    }
}

const runningOperationCounter = new RunningOperationCounter()

// This hook does 2 things that are needed to mitigate performance issues with
// slow R operations. Firstly, it debounces the function that generates the plot,
// to avoid it being triggered many times if a user is quickly changing inputs.
// Secondly, it keeps track of any operations in progress so that the plot is only
// set once the last requested calculation has resolved. This avoids the plot being
// set to an output that doesn't match the inputs while a recalculation is still running.

export const usePlot = (name: string,
                        condition: () => boolean,
                        createPlot: () => Promise<ImageBitmap>,
                        deps: any[],
                        delay: number):  [ImageBitmap | null, string] => {
    const [error, setError] = useState<string>("");
    const [plot, setPlot] = useState<ImageBitmap | null>(null);

    useEffect(() => {
        setError("")
        if (condition()) {
            const handler = setTimeout(async () => {
                setPlot(null);
                runningOperationCounter.increment(name);
                try {
                    const plot = await createPlot();
                    runningOperationCounter.decrement(name);

                    if (!runningOperationCounter.isRunning(name)) {
                        // don't set the plot if another operation has been
                        // triggered in the meantime, since this output
                        // will then be out of date
                        setPlot(plot);
                    }
                } catch (error) {
                    runningOperationCounter.decrement(name);
                    setError(`${error}`);
                }
            }, delay);

            return () => {
                clearTimeout(handler);
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, deps);
    return [plot, error]
}
