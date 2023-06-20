import {useSearchParams} from "next/navigation";
import {useMemo} from "react";

export type Caster = (input: string) => any;

export type CasterMap<T> = {
    [P in keyof T]: Caster;
}

export interface ParamsType {
    [key: string]: string | null | undefined;
}

export function useSearchParamsObject<T extends ParamsType = ParamsType>(caster?: CasterMap<T>): T {
    const params = useSearchParams();

    return useMemo(() => {
        const result = {} as any;
        params.forEach((value, key) => {
            if (value?.length) {
                if (typeof caster?.[key] === 'function') {
                   result[key] = caster[key](value);
                } else {
                    result[key] = value;
                }
            }
        });
        return result;
    }, [params]);
}