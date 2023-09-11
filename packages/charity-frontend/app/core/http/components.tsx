'use client';

import {createContext, memo, PropsWithChildren, useCallback, useContext, useEffect} from "react";
import {useSession} from "next-auth/react";
import {CRUDService} from "@/app/core/http/utils";

export type Type<T> = new (token: string) => T;

export interface ClientServiceContext {
    getService: <T, S extends CRUDService<T> = CRUDService<T>>(type: Type<S>) => S;
}

const clientServiceContext = createContext<ClientServiceContext>({} as any);

const serviceMap = new Map<Type<any>, any>();

export const ClientServiceProvider = memo(function ClientServiceProvider({children}: PropsWithChildren) {
    const {data, status} = useSession();
    const accessToken = (data as any)?.accessToken;

    useEffect(() => {
        serviceMap.forEach((service) => {
            service.setStatus(status);
        });
    }, [status]);

    useEffect(() => {
        serviceMap.forEach(service => {
            service.setToken(accessToken);
        });
    }, [accessToken]);

    const getService = useCallback<ClientServiceContext['getService']>(<T, S extends CRUDService<T> = CRUDService<T>>(type: Type<S>): S => {
        if (serviceMap.has(type)) {
            return serviceMap.get(type);
        }
        const s = new type(accessToken);
        s.setStatus(status);
        serviceMap.set(type, s);
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
