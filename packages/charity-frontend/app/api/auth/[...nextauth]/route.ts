import NextAuth, {AuthOptions} from "next-auth";
import KeycloakProvider from "next-auth/providers/keycloak";

export const authOptions: AuthOptions = {
    providers: [
        KeycloakProvider({
            issuer: 'http://localhost:8081/realms/charity',
            clientId: 'frontend',
            clientSecret: 'n7hagBASWmKpqCZSKgnbXCwxirkMj0n7',

        })
    ],
    secret: process.env.NEXTAUTH_SECRET,
    callbacks: {
        session({ session, token, user }) {
            (session.user as any).id = token.id;
            (session as any).accessToken = token.accessToken;
            return session;
        },
        jwt({ token, user, account, profile, isNewUser }) {
            if (user) {
                token.id = user.id;
            }
            if (account) {
                token.accessToken = account.access_token;
            }
            return token;
        },
    }
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST }