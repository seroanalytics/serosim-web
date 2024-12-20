import {useState} from "react";
import {useDebouncedEffect} from "./useDebouncedEffect";

export const useAsyncEffectSafely = (func: () => Promise<void>, deps: any[], delay: number = 250): string => {

    const [error, setError] = useState<string>("");

    useDebouncedEffect(() => {
        const runAsyncFunc = async () => {
            setError("");
            try {
                await func()
            } catch (error) {
                console.log(error)
                setError(`${error}`);
            }
        }

        runAsyncFunc();
    }, deps, delay)

    return error
}
