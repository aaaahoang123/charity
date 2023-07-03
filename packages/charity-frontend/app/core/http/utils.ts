import Axios, {AxiosHeaders, AxiosInstance} from "axios";
import {API_URL, BACKEND_API_URL} from "@/app/core/constant";
import Rest from "@/app/core/model/rest";
import {isBrowser, isWebWorker} from 'browser-or-node';
import Logger from "js-logger";

const logger = Logger.get('HttpUtils');

const baseURL = (isBrowser || isWebWorker)
    ? API_URL
    : BACKEND_API_URL;

export const getAxiosInstance = (token?: string) => {
    const headers = new AxiosHeaders({
        Accept: 'application/json',
    });
    if (token) {
        logger.info('Set token to axios instance when create. Token is: ' + token);
        headers.set('Authorization', `Bearer ${token}`);
    } else {
        logger.info('There are no jwt token, request as anonymous');
    }
    return Axios.create({
        baseURL,
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

    protected getCreatePath() {
        return this.getApiPath();
    }

    protected getListPath() {
        return this.getApiPath();
    }

    protected getDetailPath(id: string | number) {
        return this.getApiPath() + `/${id}`;
    }

    protected getUpdatePath(id: string | number) {
        return this.getApiPath() + `/${id}`;
    }

    protected getDeletePath(id: string | number) {
        return this.getApiPath() + `/${id}`;
    }

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
            () => this.axios.post<Rest<T>>(this.getCreatePath(), body)
                .then(({data}) => data)
        );
    }

    delete(id: string | number): Promise<Rest<T>> {
        return this.waitForReady(
            () => this.axios.delete<Rest<T>>(this.getDeletePath(id))
                .then(({data}) => data)
        );
    }

    detail(id: string | number): Promise<Rest<T>> {
        return this.waitForReady(
            () => this.axios.get<Rest<T>>(this.getDetailPath(id))
                .then(({data}) => data)
        );
    }

    list(params: any): Promise<Rest<T[]>> {
        return this.waitForReady(
            () => this.axios.get<Rest<T[]>>(this.getListPath(), {
                params,
            }).then(({data}) => data)
        );
    }

    setClient(client: AxiosInstance): void {
        this.axios = client;
    }

    update(id: string | number, body: any): Promise<Rest<T>> {
        return this.waitForReady(
            () => this.axios.put<Rest<T>>(this.getUpdatePath(id), body)
                .then(({data}) => data)
        );
    }
}
