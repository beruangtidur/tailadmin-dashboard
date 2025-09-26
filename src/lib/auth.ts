import { prisma } from '@/lib/prisma'
import { PrismaAdapter } from '@auth/prisma-adapter'
import * as bcrypt from 'bcrypt'
import NextAuth from 'next-auth'
import authConfig from './auth.config'

export const { handlers, auth, signIn, signOut } = NextAuth({
    ...authConfig,
    adapter: PrismaAdapter(prisma),

    providers: [
        ...authConfig.providers.map((provider) => {
            if (provider.id === "credentials") {
                return {
                    ...provider,
                    async authorize(credentials: any) {
                        if (!credentials?.email || !credentials?.password) return null

                        const user = await prisma.user.findUnique({
                            where: { email: credentials.email },
                        })
                        if (!user || !user.password) return null

                        const isValid = await bcrypt.compare(credentials.password, user.password)
                        if (!isValid) return null

                       return user
                    },
                }
            }
            return provider
        }),
    ],
    pages: {
        signIn: "/login",
    },
})