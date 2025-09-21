import * as bcrypt from 'bcrypt';
import { prisma } from "@/lib/prisma";
// import type { NextRequest } from "next/server";

import { NextResponse } from "next/server";

interface Params {
    params: { id: string }
}
type ApiResponse = {
    status: 'success' | 'error'
    msg: string,
    data?: null
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
    const body = await req.json()

    const id = params.id
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
    // console.log(req)
}

export async function DELETE(req: Request, { params }: Params) {
    const id = params.id

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