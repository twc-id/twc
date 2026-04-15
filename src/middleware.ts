import { NextRequest, NextResponse } from 'next/server'

const SKIP_PATHS = ['/maintenance', '/_next', '/api', '/favicon', '/images', '/locales', '/.well-known']

export function middleware(request: NextRequest) {
    const isMaintenanceMode = process.env.NEXT_PUBLIC_MAINTENANCE_MODE === 'true'
    const { pathname } = request.nextUrl

    // Skip static/internal paths and the maintenance page itself
    const shouldSkip = SKIP_PATHS.some((path) => pathname.startsWith(path))
    if (shouldSkip) return NextResponse.next()

    if (isMaintenanceMode) {
        const url = request.nextUrl.clone()
        url.pathname = '/maintenance'
        return NextResponse.redirect(url)
    }

    return NextResponse.next()
}

export const config = {
    matcher: ['/', '/((?!_next/static|_next/image|favicon.ico).+)']
}
