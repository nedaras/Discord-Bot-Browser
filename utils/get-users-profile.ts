import type { User } from 'firebase/auth'

import { getProfile } from './discord'

// TODO: if the access token is expired use refresh token to update it
// TODO: and update it at firebase with old access token to new access token

export default async function getUsersProfile(user: User) {

    if (process.browser) {

        const [ access_token ] = user ? await getTokens(user) : [ null, null ]
        const profile = access_token ? await getProfile(access_token) : null

        return profile

    }

    return null

}

async function getTokens(user: User): Promise<[ string, string ] | [ null, null ]> {

    const { claims } = await user.getIdTokenResult()
    const { access_token, refresh_token } = claims

    if (typeof access_token === 'string' && typeof refresh_token === 'string') return [ access_token, refresh_token ]
    return [ null, null ]

}