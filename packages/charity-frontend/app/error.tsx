'use client';

import {useEffect} from "react";

const Error = ({error, reset}: any) => {
    useEffect(() => {
        // Log the error to an error reporting service
        console.log(JSON.stringify(error, Object.getOwnPropertyNames(error)));
    }, [error])
    return (
        <div>
            oops
        </div>
    )
};

export default Error;