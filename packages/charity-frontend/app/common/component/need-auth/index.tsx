import {Role} from "@/app/core/role";
import {matchAnyRoles} from "@/app/api/auth/[...nextauth]/route";
import {PropsWithChildren} from "react";
import RedirectLogin from "@/app/common/component/need-auth/redirect-login";
import AccessDenied from "@/app/common/component/need-auth/access-denied";

export interface NeedAuthProps {
    roles?: Role[];
}
const NeedAuth = async ({roles, children}: PropsWithChildren<NeedAuthProps>) => {
    if (!roles?.length) {
        return <>{children}</>;
    }

    const isMatch = await matchAnyRoles(roles);

    if (isMatch === 'unauthenticated') {
        return <RedirectLogin />;
    }

    if (isMatch === 'access-denied') {
        return <AccessDenied />
    }

    return <>{children}</>;
};

export default NeedAuth;