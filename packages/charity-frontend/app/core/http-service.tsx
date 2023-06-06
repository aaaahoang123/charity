import Axios, {AxiosHeaders, AxiosInstance} from "axios";
import {API_URL} from "@/app/core/constant";
import {createContext, memo, PropsWithChildren, useCallback, useContext, useEffect, useMemo, useRef} from "react";
import {useSession} from "next-auth/react";
import Rest from "@/app/core/model/rest";

export type Type<T> = new (_: AxiosInstance) => T;

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

export interface CRUDService<T = any> {
    setClient(client: AxiosInstance): void;
    setStatus(status: 'authenticated' | 'loading' | 'unauthenticated'): void;
    list(params: any): Promise<Rest<T[]>>;
    create(body: any): Promise<Rest<T>>;
    detail(id: string | number): Promise<Rest<T>>;
    update(id: string | number, body: any): Promise<Rest<T>>;
    delete(id: string | number): Promise<Rest<T>>;
}

export abstract class BaseCRUDService<T> implements CRUDService<T> {
    protected _status: 'authenticated' | 'loading' | 'unauthenticated' = 'loading';
    constructor(protected axios: AxiosInstance) {
    }

    public setStatus(status: 'authenticated' | 'loading' | 'unauthenticated') {
        this._status = status;
    }

    abstract getApiPath(): string;

    /**
     * Block the request until the service ready with sessions provided from backend
     * @param fn
     * @protected
     */
    protected waitForReady<T>(fn: () => Promise<T>): Promise<T> {
        return new Promise((resolve, reject) => {
            const checkValue = () => {
                if (this._status !== 'loading') {
                    fn().then(resolve).catch(reject);
                } else {
                    setTimeout(checkValue, 100);
                }
            };

            checkValue();
        });
    }

    create(body: any): Promise<Rest<T>> {
        return this.waitForReady(
            () => this.axios.post<Rest<T>>(this.getApiPath(), body)
                .then(({data}) => data)
        );
    }

    delete(id: string | number): Promise<Rest<T>> {
        return this.waitForReady(
            () => this.axios.delete<Rest<T>>(this.getApiPath() + `/${id}`)
                .then(({data}) => data)
        );
    }

    detail(id: string | number): Promise<Rest<T>> {
        return this.waitForReady(
            () => this.axios.get<Rest<T>>(this.getApiPath() + `/${id}`)
                .then(({data}) => data)
        );
    }

    list(params: any): Promise<Rest<T[]>> {
        return this.waitForReady(
            () => this.axios.get<Rest<T[]>>(this.getApiPath(), {
                params,
            }).then(({data}) => data)
        );
    }

    setClient(client: AxiosInstance): void {
        this.axios = client;
    }

    update(id: string | number, body: any): Promise<Rest<T>> {
        return this.waitForReady(
            () => this.axios.put<Rest<T>>(this.getApiPath() + `/${id}`, body)
                .then(({data}) => data)
        );
    }



}

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
        for (const [k, service] of Object.entries(serviceRef.current)) {
            service.setStatus(status);
        }
    }, [status]);

    useEffect(() => {
        for (const [k, service] of Object.entries(serviceRef.current)) {
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
