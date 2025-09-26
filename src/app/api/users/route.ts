import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import * as bcrypt from 'bcrypt';

import { NextResponse } from "next/server";

export type ApiResponse<T = unknown> = {
    status: 'success' | 'error'
    msg: string
    data?: T
}

export const GET = auth(async (req) => {
    const users = await prisma.user.findMany({
        select: { id: true, username: true, email: true, role: true },
        orderBy: { createdAt: 'asc' }
    })

    return NextResponse.json<ApiResponse>({
        "status": "success",
        "msg": "All users are loaded",
        "data": users
    }, { status: 200 })
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

    if (user) return NextResponse.json<ApiResponse>({
        "status": "error",
        "msg": "User already Exists",
    }, { status: 409 })

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
    }, { status: 201 })
}