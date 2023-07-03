import {API_URL, BACKEND_API_URL} from "@/app/core/constant";
import Rest from "@/app/core/model/rest";
import {isBrowser, isWebWorker} from 'browser-or-node';
import Logger from "js-logger";

const logger = Logger.get('HttpUtils');

const baseURL = (isBrowser || isWebWorker)
    ? API_URL
    : BACKEND_API_URL;

export interface CRUDService<T = any> {
    setToken(token?: string): void;
    setStatus(status: 'authenticated' | 'loading' | 'unauthenticated'): void;
    list(params: any): Promise<Rest<T[]>>;
    create(body: any): Promise<Rest<T>>;
    detail(id: string | number): Promise<Rest<T>>;
    update(id: string | number, body: any): Promise<Rest<T>>;
    delete(id: string | number): Promise<Rest<T>>;
}

export abstract class BaseCRUDService<T> implements CRUDService<T> {
    protected _status: 'authenticated' | 'loading' | 'unauthenticated' = 'loading';
    constructor(
        protected token?: string,
    ) {
    }

    setToken(token?: string) {
        this.token = token;
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
            () => this.doFetch<Rest<T>>(this.getCreatePath(), {
                method: 'POST',
                body: body ? JSON.stringify(body) : undefined,
            })
        )
    }

    delete(id: string | number): Promise<Rest<T>> {
        return this.waitForReady(
            () => this.doFetch<Rest<T>>(this.getDeletePath(id), {
                method: 'DELETE',
            })
        );
    }

    detail(id: string | number): Promise<Rest<T>> {
        return this.waitForReady(
            () => this.doFetch<Rest<T>>(this.getDetailPath(id))
        );
    }

    list(params: any): Promise<Rest<T[]>> {
        const searchParams = new URLSearchParams(params);
        return this.waitForReady(
            () => this.doFetch<Rest<T[]>>(this.getListPath() + '?' + searchParams.toString())
        );
    }

    update(id: string | number, body: any): Promise<Rest<T>> {
        return this.waitForReady(
            () => this.doFetch<Rest<T>>(this.getUpdatePath(id), {
                method: 'PUT',
                body: body ? JSON.stringify(body) : undefined,
            })
        );
    }

    async doFetch<R>(url: string, init?: RequestInit): Promise<R> {
        const options = init ?? {};
        const headers = new Headers({
            'Content-Type': 'application/json',
            ...init?.headers ?? {},
            Accept: 'application/json',
            // Authorization: !!this.token?.length ? `Bearer ${this.token}` : undefined,
        });
        if (!!this.token?.length) {
            headers.append('Authorization', `Bearer ${this.token}`);
            logger.info('Use authorization to request');
        }
        options.headers = headers;
        const response = await fetch(baseURL + url, options);
        const json = await response.json();
        if (!response.ok) {
            throw new Error('Request failed with status: ' + response.status + '. Reason: ' + json);
        }

        return json;
    }
}
