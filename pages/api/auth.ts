import type { NextApiRequest, NextApiResponse } from 'next'

import type { ApiResponse } from '../../@types/apiResponse'

import { getToken } from '../../utils/discord'

interface Query {
    [key: string]: string | undefined | (string | undefined)[]
    code: string | undefined

}

interface AuthResponse {
    jwt: string

}

export default async function handler(request: NextApiRequest, response: NextApiResponse<ApiResponse<AuthResponse>>) {

    const { code } = request.query as Query

    if (!code) return response.status(400).json({
        status: 400,
        message: '"code" was not passed in'

    })

    const token = await getToken(code)

    token ? response.json({ jwt: token }) :  response.json({
        status: 400,
        message: "invalid code"

    })

}