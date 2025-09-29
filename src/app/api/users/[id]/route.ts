import * as bcrypt from 'bcrypt';
import { prisma } from "@/lib/prisma";
// import type { NextRequest } from "next/server";

import { NextResponse } from "next/server";

type Params = {
    params: { id: string }
}
type updateUser = {
    username?: string,
    email?: string,
    role?: string,
    name?: string,
}

type resetPassword = {
    password: string
}

type ApiResponse = {
    status: 'success' | 'error'
    msg: string,
    data?: {}
}

export async function GET(req: Request, { params }: Params) {
    try {
        const user = await prisma.user.findUnique({
            where: { id: params.id },
            select: { id: true, username: true, email: true, role: true, createdAt: true }
        })

        if (!user) return NextResponse.json({ error: "User doesn't exists" }, { status: 404 })
    } catch (error) {
        return NextResponse.json({ error: "Internal server error" }, { status: 500 })
    }
}


export async function PUT(req: Request, { params }: Params) {
    const body: updateUser = await req.json()

    const { id } = await params
    try {
        const updatedUser = await prisma.user.update({
            where: { id },
            data: body,
        })
        return NextResponse.json<ApiResponse>({
            status: "success",
            msg: "User updated successfully",
            data: updatedUser
        })
    } catch (error) {
        return NextResponse.json<ApiResponse>({
            status: "error",
            msg: "User failed to edit",
        })
    }
}

export async function PATCH(req: Request, { params }: Params) {
    const body : resetPassword = await req.json()

    const {id} = await params
    try {
        const resetPassword = await prisma.user.update({
            where: { id },
            data: body,
        })
        return NextResponse.json<ApiResponse>({
            status: "success",
            msg: "User password has been reset",
            data: resetPassword
        })
    } catch (error) {
        return NextResponse.json<ApiResponse>({
            status: "error",
            msg: "User failed to edit",
        })
    }
}

export async function DELETE(req: Request, { params }: Params) {
    const {id} = await params

    try {
        const deletedUser = await prisma.user.delete({
            where: { id }
        })

        return NextResponse.json<ApiResponse>({
            status: "success",
            msg: "User deleted successfully",
            data: deletedUser
        })
    } catch (error) {
        return NextResponse.json<ApiResponse>({
            status: "error",
            msg: "User failed to delete",
        })
    }

}