import { Session } from "next-auth"
import { JWT } from "next-auth/jwt"

/** Example on how to extend the built-in session types */
declare module "next-auth" {
    interface Session {
        /** This is an example. You can find me in types/next-auth.d.ts */
        user: {
            /** The user's postal address. */
            id: string,
            email: string,
            name: string
        }
    }

    interface RedirectCallback {
        (url: string, baseUrl: string, user?: Session['user']): Promise<string>
    }
}

