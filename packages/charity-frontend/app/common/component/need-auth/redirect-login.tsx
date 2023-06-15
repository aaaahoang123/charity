'use client';
import {signIn} from "next-auth/react";
import {useEffect} from "react";

const RedirectLogin = () => {
    useEffect(() => {
        signIn('keycloak');
    });

    return <></>;
};

export default RedirectLogin;