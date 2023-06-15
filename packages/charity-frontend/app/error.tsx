'use client';

import {useEffect} from "react";
import {NotFound} from "next/dist/client/components/error";

const Error = ({error, reset}: any) => {
    useEffect(() => {
        console.error(error);
    }, [error])
    return error.toString().includes('status code 404') ? (
        <div>
            404 Not found resource
        </div>
    ) : (
        <div>
            Server error
        </div>
    )
};

export default Error;