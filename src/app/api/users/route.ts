import { apiError, apiSuccess } from "@/lib/apiResponse";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import * as bcrypt from 'bcrypt';

export const GET = auth(async (req) => {
    const users = await prisma.user.findMany({
        select: { id: true, username: true, email: true, role: true },
        orderBy: { createdAt: 'asc' }
    })

    return apiSuccess("All users are loaded", users)
})

export async function POST(req: Request) {

    // console.log(req)
    const { username, role, email, password } = await req.json()

    const hashed = await bcrypt.hash(password, 10)
    // validation input

    const user = await prisma.user.findFirst({
        where: {
            OR: [
                { email },
                { username }
            ]
        }
    })

    if (user && user.username === username) return apiError("User already exists")
    if (user && user.email === email) return apiError("Email already exists")

    const createdUser = await prisma.user.create({
        data: {
            username,
            role,
            email,
            password: hashed
        }
    })
    
    return apiSuccess("User created successfully", createdUser)
}