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

    const [ access_token, refresh_token ] = code ? await getToken(code) : [ null, null ]
    const profile = access_token ? await getProfile(access_token) : null
    const jwt = profile ? await login(profile, access_token!, refresh_token!) : null

    jwt && response.setHeader('Set-Cookie', cokkie.serialize('token', jwt, {
        maxAge: 60 * 3,
        sameSite: 'strict',
        path: '/'

    }))

    response.redirect('/')

}