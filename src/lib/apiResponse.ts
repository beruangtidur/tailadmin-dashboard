// lib/apiResponse.ts
import { NextResponse } from "next/server"


export type ApiResponse<T = unknown> = {
    status: "success" | "error"
    msg: string
    data?: T | null
}


export function apiSuccess<T>(msg: string, data: T) {
    return NextResponse.json<ApiResponse<T>>({
        status: 'success',
        msg,
        data,
    })
}

export function apiError(msg: string) {
    return NextResponse.json<ApiResponse<null>>({
        status: 'error',
        msg,
        data: null,
    })
}