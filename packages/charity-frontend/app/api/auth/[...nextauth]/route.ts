import NextAuth, {AuthOptions} from "next-auth";
import KeycloakProvider, {KeycloakProfile} from "next-auth/providers/keycloak";
import {OAuthConfig} from "next-auth/providers";
// @ts-ignore
import {decodeJwt} from "jose";

export const authOptions: AuthOptions = {
    providers: [
        KeycloakProvider({
            issuer: process.env.KEYCLOAK_URL,
            clientId: process.env.KEYCLOAK_CLIENT ?? '',
            clientSecret: process.env.KEYCLOAK_SECRET ?? '',
        }),
    ],
    callbacks: {
        session({session, token, user}) {
            const accessToken = token.accessToken;

            (session.user as any).id = token.id;
            (session as any).accessToken = accessToken;
            if (accessToken) {
                const de = decodeJwt(accessToken);
                (session as any).resource_access = {
                    ...de.resource_access,
                    realm_access: de.realm_access,
                };
                (session as any).issuer = de.iss;
            }

            return session;
        },
        jwt({token, user, account, profile, isNewUser}) {
            if (user) {
                token.id = user.id;
            }
            if (account) {
                token.accessToken = account.access_token;
                token.idToken = account.id_token;
            }
            return token;
        },
    },
    events: {
        async signOut({token}) {
            const issuerUrl = (authOptions.providers.find(p => p.id === "keycloak") as OAuthConfig<KeycloakProfile>).options!.issuer!
            const logOutUrl = new URL(`${issuerUrl}/protocol/openid-connect/logout`)
            logOutUrl.searchParams.set("id_token_hint", token.idToken! as any);
            await fetch(logOutUrl);
        },
    }
};

const handler = NextAuth(authOptions);

export {handler as GET, handler as POST}