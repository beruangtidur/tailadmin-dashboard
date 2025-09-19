import { prisma } from "@/lib/prisma";
import * as bcrypt from 'bcrypt';

import { NextResponse } from "next/server";

export async function GET(){
    const users = await prisma.user.findMany({
        select: {id: true, username:true, email:true, role:true},
        orderBy: {createdAt: 'asc'}
    })

    return NextResponse.json(users)
}

export async function POST(req: Request) {
    
    // console.log(req)
    const {username, role, email, password } = await req.json()

    const hashed = await bcrypt.hash(password,10)
    // validation input
    const createdUser = await prisma.user.create({
        data: {
            username,
            role,
            email,
            password: hashed
        }
    })
    return NextResponse.json(createdUser)
}