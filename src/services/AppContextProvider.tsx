import {
    createContext,
    Dispatch,
    ReactNode,
    useContext,
    useEffect,
    useMemo,
    useReducer
} from "react";
import { RService, WebRService} from "./RService";
import {rootReducer} from "../rootReducer";
import {empty} from "../scenarios";
import {
    AppState,
    Action,
    ActionType
} from "../types";

interface SeroSimContext {
    rService: RService
    state: AppState
    dispatch: Dispatch<Action>
}

export const AppContext = createContext<SeroSimContext>({
    rService: null as any,
    state: empty,
    dispatch: () => null
});

export const useAppContext = () => {
    return useContext(AppContext);
};

export const AppContextProvider = ({children}: { children: ReactNode }) => {

    const [state, dispatch] = useReducer(rootReducer, empty);
    const rService = useMemo(() => {
        const rService = new WebRService();
        dispatch({
            type: ActionType.R_READY,
            payload: false
        });
        rService.init()
        return rService
    }, []);

    useEffect(() => {

        rService
            .waitForReady()
            .then(() => {
                dispatch({
                    type: ActionType.R_READY,
                    payload: true
                });
            });
    }, [rService, dispatch]);


    return <AppContext.Provider
        value={{rService, state, dispatch}}>{children}</AppContext.Provider>;
};
