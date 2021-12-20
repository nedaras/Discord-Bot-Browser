import type { User } from 'firebase/auth'

import { getProfile } from './discord'

export default async function getUsersProfile(user: User) {

    if (process.browser) {

        const access_token = await getToken(user)
        const profile = access_token ? await getProfile(access_token) : null

        return profile

    }

    return null

}

async function getToken(user: User) {

    const { claims } = await user.getIdTokenResult()
    const { access_token } = claims

    if (typeof access_token === 'string') return access_token
    return null

}