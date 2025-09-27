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
                        if (!credentials?.uoe || !credentials?.password) return null

                        // const type = credentials.uoe.includes('@') ? 'email' : 'username'

                        // const loginSchema = z.email().or(z.string().min(3).max(20).regex(/^[a-zA-Z0-9_]+$/))
                        // const parse = loginSchema.safeParse(credentials.uoe)

                        // if (!parse.success) return null
                        const user = await prisma.user.findFirst({
                            where: {
                                OR: [
                                    { email: credentials.uoe },
                                    { username: credentials.uoe }
                                ]
                            }
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