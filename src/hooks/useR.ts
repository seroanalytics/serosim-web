import {useState} from "react";
import {useDebouncedEffect} from "./useDebouncedEffect";

export const useR = (func: () => Promise<void>, deps: any[], delay: number = 250): string => {

    const [error, setError] = useState<string>("");

    useDebouncedEffect(() => {
        const runRCode = async () => {
            setError("");
            try {
                await func()
            } catch (error) {
                console.log(error)
                setError(`${error}`);
            }
        }

        runRCode();
    }, deps, delay)

    return error
}
