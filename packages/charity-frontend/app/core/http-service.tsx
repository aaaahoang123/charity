import Axios, {AxiosHeaders, AxiosInstance} from "axios";
import {API_URL} from "@/app/core/constant";
import {createContext, memo, PropsWithChildren, useCallback, useContext, useMemo, useRef, useState} from "react";
import {useSession} from "next-auth/react";

let httpService: AxiosInstance;
const getAxiosInstance = (token?: string) => {
    if (httpService) {
        if (token) {
            httpService.defaults.headers.common.Authorization = `Bearer ${token}`;
        } else {
            delete httpService.defaults.headers.common.Authorization;
        }
        return httpService;
    }
    const headers = new AxiosHeaders({
        Accept: 'application/json',
    });
    if (token) {
        headers.set('Authorization', `Bearer ${token}`);
    }
    return httpService = Axios.create({
        baseURL: API_URL,
        headers,
    });
};

export interface CRUDService {
    setClient(client: AxiosInstance): void;
    list(params: any): Promise<any>;
    create(body: any): Promise<any>;
    detail(id: string | number): Promise<any>;
    update(id: string | number, body: any): Promise<any>;
    delete(id: string | number): Promise<any>;
}

export abstract class BaseCRUDService implements CRUDService {
    constructor(protected axios: AxiosInstance) {
    }

    abstract getApiPath(): string;
    create(body: any): Promise<any> {
        return Promise.resolve(undefined);
    }

    delete(id: string | number): Promise<any> {
        return Promise.resolve(undefined);
    }

    detail(id: string | number): Promise<any> {
        return Promise.resolve(undefined);
    }

    list(params: any): Promise<any> {
        return this.axios.get(this.getApiPath(), {
            params,
        });
    }

    setClient(client: AxiosInstance): void {
        this.axios = client;
    }

    update(id: string | number, body: any): Promise<any> {
        return Promise.resolve(undefined);
    }

}

export interface ClientServiceContext {
    axios: AxiosInstance;
    getService: (type: new (_: AxiosInstance) => CRUDService) => CRUDService;
}
const clientServiceContext = createContext<ClientServiceContext>({} as any);

export const ClientServiceProvider = memo(function ClientServiceProvider({children}: PropsWithChildren) {
    const {data} = useSession();
    const accessToken = (data as any)?.accessToken;
    const axios = useMemo(() => {
        return getAxiosInstance(accessToken);
    }, [accessToken]);

    const serviceRef = useRef<{[key: string]: CRUDService}>({});

    const [services, setServices] = useState<{[key: string]: CRUDService}>({});
    const getService = useCallback<ClientServiceContext['getService']>((type) => {
        if (services[type.name]) {
            const s = serviceRef.current[type.name];
            s.setClient(axios);
            return s;
        }
        const s = new type(axios);
        serviceRef.current[type.name] = s;
        return s;
    }, [axios]);

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

export const useService = (type: new (_: AxiosInstance) => CRUDService) => {
    const contextValue = useContext(clientServiceContext);
    return contextValue.getService(type);
};
