import NextAuth from "next-auth"
import authConfig from "./lib/auth.config"
import { NextResponse } from "next/server"
 
const { auth } = NextAuth(authConfig)

export const middleware = async (req: any) =>{
    
    const session =  await auth()
    const pathname = req.nextUrl.pathname
    
    if(pathname.startsWith('/api') && !pathname.startsWith("/api/auth")){
        if(session === null){
            return NextResponse.json({
                status: 'error',
                msg: 'Unauthorized'
            }, {status: 401})
        }
    } else {
        if(session === null && pathname !== "/login"){
            return NextResponse.redirect(new URL('/login', req.url))
        }
    
        if(session !== null && pathname === "/login"){
            return NextResponse.redirect(new URL('/', req.url))
        }   
    }
}


export const config = {
//   matcher: ["/((?!api|_next/static|_next/image|images|favicon.ico).*)"],
  matcher: ["/((?!api/auth|_next/static|_next/image|images|favicon.ico).*)"],
}