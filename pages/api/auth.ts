import type { NextApiRequest, NextApiResponse } from 'next'

import { JsonObject } from '../../@types'

import { getProfile, getToken } from '../../utils/discord'
import { login } from '../../utils/auth'

import cokkie from 'cookie'

export default async function handler(request: NextApiRequest, response: NextApiResponse) {

    const { code } = request.query as JsonObject<string | undefined>

    const access_token = code ? await getToken(code) : null
    const profile = access_token ? await getProfile(access_token) : null
    const jwt = profile ? await login(profile, access_token!) : null

    jwt && response.setHeader('Set-Cookie', cokkie.serialize('token', jwt, {
        maxAge: 60,
        sameSite: 'strict',
        path: '/'

    }))

    response.redirect('/loggedin')

}