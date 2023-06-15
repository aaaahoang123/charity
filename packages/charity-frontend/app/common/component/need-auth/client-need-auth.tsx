'use client';

import {PropsWithChildren, useMemo} from "react";
import {useSession} from "next-auth/react";
import {sessionMatchAnyRoles} from "@/app/api/auth/[...nextauth]/route";
import {Role} from "@/app/core/role";

export interface ClientNeedAuthProps {
    roles?: Role[];
}

const ClientNeedAuth = ({children, roles}: PropsWithChildren<ClientNeedAuthProps>) => {
    const {data: session} = useSession();

    const isMatch = useMemo(() => {
        return sessionMatchAnyRoles(session, roles);
    }, [session, roles]);

    if (isMatch === true) {
        return <>{children}</>;
    }

    return null;
};

export default ClientNeedAuth;