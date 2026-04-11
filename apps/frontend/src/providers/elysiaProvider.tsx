import backendUrl from "@/config/env";
import { treaty } from "@elysiajs/eden/treaty2";
import type { App } from "primary-backend";
import { createContext, useContext } from "react";

const client = treaty<App>(backendUrl);

const ElysiaContext = createContext(client);

export const ElysiaContextProvider = ElysiaContext.Provider;

const useElysiaClient = () => {
  return useContext(ElysiaContext);
};

export default useElysiaClient;