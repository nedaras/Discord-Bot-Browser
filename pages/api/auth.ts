import type { NextApiRequest, NextApiResponse } from 'next'

import { getProfile, getToken } from '../../utils/discord'
import { login } from '../../utils/auth'

import cokkie from 'cookie'

interface Query {
    [key: string]: string | undefined | (string | undefined)[]
    code: string | undefined

}

export default async function handler(request: NextApiRequest, response: NextApiResponse) {

    const { code } = request.query as Query

    const token = code ? await getToken(code) : undefined
    const profile = token ? await getProfile(token) : undefined
    const jwt = profile ? await login(profile) : undefined

    jwt && response.setHeader('Set-Cookie', cokkie.serialize('token', jwt, {
        httpOnly: true,
        maxAge: 60 * 60,
        sameSite: 'strict',
        path: '/'

    }))

    response.redirect('/')

}