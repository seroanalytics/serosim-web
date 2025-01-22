import React, {useEffect, useRef, useState} from "react";
import {ScaleLoader} from "react-spinners";
import {useAppContext} from "../services/AppContextProvider";
import {DownloadCloudIcon} from "lucide-react";
import {Button} from "react-bootstrap";
import {downloadImage} from "../services/downloadUtils";

export function CanvasPlot({plot, error, title}: {
    plot: ImageBitmap | null,
    title: string,
    error?: string | null
}) {

    const {state} = useAppContext();
    const canvasRef = useRef<HTMLCanvasElement | null>()
    const [downloading, setDownloading] = useState<boolean>(false);

    let message = "Generating plot";
    if (!state.rReady) {
        message = "Waiting for R to be ready"
    }

    useEffect(() => {

        const el = document.getElementById(title)
        if (canvasRef.current) {
            canvasRef.current.remove()
        }
        if (el) {
            el.replaceChildren()
        }
        if (plot && el) {
            const canvas = document.createElement("canvas");
            canvas.width = plot.width;
            canvas.height = plot.height;
            const ctx = canvas.getContext("2d")!!;
            ctx.drawImage(plot, 0, 0, canvas.width, canvas.height);

            canvasRef.current = canvas
            el.appendChild(canvas)
        }
    }, [plot, title]);

    async function downloadPlot() {
        if (plot) {
            setDownloading(true);
            await downloadImage(plot, `${title}.png`);
            setDownloading(false);
        }
    }

    if (!plot) {
        return <div className={"py-5 text-center"}>
            {error ? "Plot could not be rendered" : <ScaleLoader role={"loader"}/>}
            {!error && message}
        </div>
    } else {
        return <div className={"border p-2 text-end"} data-testid={title}>
            <div id={title}></div>
            <Button size={"sm"}
                    onClick={downloadPlot}
                    variant={"secondary"}
                    disabled={downloading}>
                <DownloadCloudIcon/> Download
            </Button>
        </div>
    }
}
