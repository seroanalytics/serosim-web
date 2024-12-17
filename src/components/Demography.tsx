import React, {useState, useEffect, useContext} from "react";
import {RContext} from "../RContext";
import {PlotlyPlot} from "./PlotlyPlot";

export function Demography() {

    const [N, setN] = useState<number>(100);
    const [plot, setPlot] = useState<any>(null);
    const [loading, setLoading] = useState<boolean>(true);

    const dataService = useContext(RContext);

    useEffect(() => {
        const runRCode = async () => {
            setLoading(true);
            try {
                const result = await dataService.getDemography(N);
                setPlot(result);
            } catch (error) {
                console.error("Error running R code:", error);
                setPlot(null);
            }
            setLoading(false);
        };

        runRCode();

    }, [dataService, N]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setN(parseInt(e.target.value));
    };

    return (
        <div>
            <label>
                Enter a number:
                <input type="number" value={N} onChange={handleChange}/>
            </label>
            {loading ? (
                <p>Loading...</p>
            ) : (
                <div>
                    {plot && <PlotlyPlot plot={plot}/>}
                </div>
            )}
        </div>
    );
}
