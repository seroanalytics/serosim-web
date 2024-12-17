import {createContext} from "react";
import {DataService} from "./services/dataService";

export const RContext = createContext<DataService>(new DataService());
