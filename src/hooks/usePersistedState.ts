import { useEffect, useState } from "react";

// to store the state to local storage
export default function usePersistedState<T>(key: string, defaultValue: T) {
    const [state, setState] = useState(defaultValue);

    useEffect(() => {
        setState(localStorage.getItem(key) as T);
    }, [key]);

    const setWithLocalStorage = (nextState: T) => {
        localStorage.setItem(key, nextState as string);
        setState(nextState);
    };

    return [state, setWithLocalStorage];
}
