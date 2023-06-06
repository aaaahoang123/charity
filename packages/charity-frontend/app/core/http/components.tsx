'use client';

import {AxiosInstance} from "axios";
import {createContext, memo, PropsWithChildren, useCallback, useContext, useEffect, useMemo, useRef} from "react";
import {useSession} from "next-auth/react";
import {CRUDService, getAxiosInstance} from "@/app/core/http/utils";

export type Type<T> = new (_: AxiosInstance) => T;

export interface ClientServiceContext {
    axios: AxiosInstance;
    getService: <T, S extends CRUDService<T> = CRUDService<T>>(type: Type<S>) => S;
}
const clientServiceContext = createContext<ClientServiceContext>({} as any);

export const ClientServiceProvider = memo(function ClientServiceProvider({children}: PropsWithChildren) {
    const {data, status} = useSession();
    const accessToken = (data as any)?.accessToken;
    const axios = useMemo(() => {
        return getAxiosInstance(accessToken);
    }, [accessToken]);

    const serviceRef = useRef<{[key: string]: CRUDService}>({});

    useEffect(() => {
        for (const [, service] of Object.entries(serviceRef.current)) {
            service.setStatus(status);
        }
    }, [status]);

    useEffect(() => {
        for (const [, service] of Object.entries(serviceRef.current)) {
            service.setClient(axios);
        }
    }, [axios]);

    const getService = useCallback<ClientServiceContext['getService']>(<T, S extends CRUDService<T> = CRUDService<T>>(type: Type<S>): S => {
        if (serviceRef.current[type.name]) {
            const s = serviceRef.current[type.name];
            return s as any;
        }
        const s = new type(axios);
        s.setStatus(status);
        serviceRef.current[type.name] = s;
        return s;
    }, [axios, status]);

    return (
        <clientServiceContext.Provider value={{
            axios,
            getService
        }}>
            {children}
        </clientServiceContext.Provider>
    );
});

export const useAxios = () => {
    const contextValue = useContext(clientServiceContext);
    return contextValue.axios;
};

export const useService = <T, S extends CRUDService<T>>(type: Type<S>): S => {
    const contextValue = useContext(clientServiceContext);
    return contextValue.getService(type);
};
