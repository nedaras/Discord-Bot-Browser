import type { NextRequest } from 'next/server'
import { ResponseError } from '../../@types/apiResponse'
import { postData } from '../../utils/fetch-data'

interface ResponseType {
    guild_id: string

}

export async function middleware(request: NextRequest) {
    
    const guild_id = request.nextUrl.pathname.split('/')[2]
    const response = await postData<ResponseType | ResponseError>('http://localhost:4000/api/guild', { guild_id })

    if ((response as ResponseError).message !== undefined) return new Response('Lost?')

}