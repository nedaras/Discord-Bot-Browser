import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

import { JsonObject } from '../@types'

export function middleware(request: NextRequest) {
	const { token, guild } = request.cookies as JsonObject<string | undefined>

	if (token && guild && request.nextUrl.pathname !== '/loggedin') return NextResponse.redirect('/loggedin')
}
