
export interface RestMeta {
    currentPage: number;
    lastPage: number;
    size: number;
    total: number;
}

interface Rest<T> {
    status: number;
    message: string;
    data: T;
    meta?: RestMeta;
    timestampMs: string;
}

export default Rest;