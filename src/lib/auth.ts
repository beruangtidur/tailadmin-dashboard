import { prisma } from '@/lib/prisma'
import { PrismaAdapter } from '@auth/prisma-adapter'
import NextAuth from 'next-auth'
import type { Provider } from 'next-auth/providers'
import Credentials from 'next-auth/providers/credentials'
import * as bcrypt from 'bcrypt';

const providers: Provider[] = [
    Credentials({
        async authorize(c) {
            if (!c?.email || !c?.password) return null

            // console.log(c)
            const user = await prisma.user.findUnique({ where: { email: c.email } })
            if (!user) return null
            const isValid = await bcrypt.compare(c?.password, user.password)
            // const isValid = c.password === user.password
            if (!isValid) return null

            return user
            // return { id: '1', name: 'J Smith', email: '' }
        },
    }),
]

export const { handlers, auth, signIn, signOut } = NextAuth({
    adapter: PrismaAdapter(prisma),
    session: {
        strategy: 'jwt',
    },
    providers,
    pages: {
        signIn: "/login",
    },
})