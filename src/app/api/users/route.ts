import { prisma } from "@/lib/prisma";
import * as bcrypt from 'bcrypt';

import { NextResponse } from "next/server";

type ApiResponse = {
    status: 'success' | 'error'
    msg: string,
    data? : null
}

export async function GET() {
    const users = await prisma.user.findMany({
        select: { id: true, username: true, email: true, role: true },
        orderBy: { createdAt: 'asc' }
    })

    return NextResponse.json(users)
}

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
    // const user = await prisma.user.findUnique({
    //     where: {
    //         OR: [
    //             { email },
    //             { username }
    //         ]
    //     },
    //     select: { id: true, username: true, email: true, role: true },
    // })

    if (user) return NextResponse.json<ApiResponse>({
        "status": "error",
        "msg": "User already Exists",
    } )

    const createdUser = await prisma.user.create({
        data: {
            username,
            role,
            email,
            password: hashed
        }
    })
    return NextResponse.json<ApiResponse>({
        "status": "success",
        "msg": "User created successfully",
        "data": createdUser
    })
}