import NextAuth, {AuthOptions} from "next-auth";
import KeycloakProvider, {KeycloakProfile} from "next-auth/providers/keycloak";
import {OAuthConfig} from "next-auth/providers";
// @ts-ignore
import {decodeJwt} from "jose";
import {JWT} from "next-auth/jwt";

/**
 * Takes a token, and returns a new token with updated
 * `accessToken` and `accessTokenExpires`. If an error occurs,
 * returns the old token and an error property
 */
/**
 * @param  {JWT} token
 */
const refreshAccessToken = async (token: JWT) => {
    try {
        console.log({token, now: Date.now().valueOf(), exp: (token as any).refreshTokenExpired, isExp: Date.now() > (token as any).refreshTokenExpired});
        if (Date.now() > (token as any).refreshTokenExpired) throw new Error('Token expired');
        const details = {
            client_id: process.env.KEYCLOAK_CLIENT,
            client_secret: process.env.KEYCLOAK_SECRET,
            grant_type: ['refresh_token'],
            refresh_token: token.refreshToken,
        };
        const formBody: string[] = [];
        Object.entries(details).forEach(([key, value]: [string, any]) => {
            const encodedKey = encodeURIComponent(key);
            const encodedValue = encodeURIComponent(value);
            formBody.push(encodedKey + '=' + encodedValue);
        });
        const formData = formBody.join('&');
        const url = `${process.env.KEYCLOAK_URL}/protocol/openid-connect/token`;
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
            },
            body: formData,
        });
        const refreshedTokens = await response.json();
        if (!response.ok) throw refreshedTokens;
        return {
            ...token,
            accessToken: refreshedTokens.access_token,
            accessTokenExpired: Date.now() + (refreshedTokens.expires_in - 15) * 1000,
            refreshToken: refreshedTokens.refresh_token ?? token.refreshToken,
            refreshTokenExpired:
                Date.now() + (refreshedTokens.refresh_expires_in - 15) * 1000,
            idToken: refreshedTokens.id_token,
        };
    } catch (error) {
        return {
            ...token,
            error: 'RefreshAccessTokenError',
        };
    }
};

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
            if (token.error) {
                (session as any).error = token.error;
            }
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
            // Initial sign in
            if (account && user) {
                // Add access_token, refresh_token and expirations to the token right after signin
                token.accessToken = account.access_token;
                token.refreshToken = account.refresh_token;
                token.accessTokenExpired =
                    (account?.expires_at ?? 0 - 15) * 1000;
                token.refreshTokenExpired =
                    Date.now() + ((account as any).refresh_expires_in - 15) * 1000;
                token.user = user;
                token.idToken = account.id_token;
                return token;
            }

            // Return previous token if the access token has not expired yet
            // @ts-ignore
            if (Date.now() < token.accessTokenExpired) return token;

            // Access token has expired, try to update it
            return refreshAccessToken(token);
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