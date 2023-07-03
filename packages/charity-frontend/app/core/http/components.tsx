'use client';

import {createContext, memo, PropsWithChildren, useCallback, useContext, useEffect, useMemo, useRef} from "react";
import {useSession} from "next-auth/react";
import {CRUDService} from "@/app/core/http/utils";

export type Type<T> = new (token: string) => T;

export interface ClientServiceContext {
    getService: <T, S extends CRUDService<T> = CRUDService<T>>(type: Type<S>) => S;
}
const clientServiceContext = createContext<ClientServiceContext>({} as any);

export const ClientServiceProvider = memo(function ClientServiceProvider({children}: PropsWithChildren) {
    const {data, status} = useSession();
    const accessToken = (data as any)?.accessToken;

    const serviceRef = useRef<{[key: string]: CRUDService}>({});

    useEffect(() => {
        for (const [, service] of Object.entries(serviceRef.current)) {
            service.setStatus(status);
        }
    }, [status]);

    useEffect(() => {
        for (const [, service] of Object.entries(serviceRef.current)) {
            service.setToken(accessToken);
        }
    }, [accessToken]);

    const getService = useCallback<ClientServiceContext['getService']>(<T, S extends CRUDService<T> = CRUDService<T>>(type: Type<S>): S => {
        if (serviceRef.current[type.name]) {
            const s = serviceRef.current[type.name];
            return s as any;
        }
        const s = new type(accessToken);
        s.setStatus(status);
        serviceRef.current[type.name] = s;
        return s;
    }, [accessToken, status]);

    return (
        <clientServiceContext.Provider value={{
            getService
        }}>
            {children}
        </clientServiceContext.Provider>
    );
});

export const useService = <T, S extends CRUDService<T>>(type: Type<S>): S => {
    const contextValue = useContext(clientServiceContext);
    return contextValue.getService(type);
};
