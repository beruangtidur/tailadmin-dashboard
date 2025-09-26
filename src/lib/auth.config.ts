import type { NextAuthConfig } from "next-auth"
import Credentials from "next-auth/providers/credentials"

// Notice this is only an object, not a full Auth.js instance
export default {
    session: {
        strategy: 'jwt',
        maxAge: 60 * 60, // 1 hour
    },
    providers: [
        Credentials({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" },
            },
            // ❌ Jangan isi authorize di sini!
        }),
    ],
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id
                token.username = user.username
                token.email = user.email
                token.role = user.role
            }
            return token
        },
        async session({ session, token }) {
            if (token) {
                session.user.id = token.id
                session.user.username = token.username
                session.user.email = token.email
                session.user.role = token.role
            }

            return session
        }
    }
} satisfies NextAuthConfig