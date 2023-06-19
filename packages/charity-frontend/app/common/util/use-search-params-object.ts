import {useSearchParams} from "next/navigation";
import {useMemo} from "react";

export function useSearchParamsObject<T extends {[key: string]: any} = {[key: string]: any}>(): T {
    const params = useSearchParams();

    return useMemo(() => {
        const result = {} as any;
        params.forEach((value, key) => {
            result[key] = value;
        });
        return result;
    }, [params]);
}