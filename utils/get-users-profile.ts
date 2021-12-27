import type { User } from 'firebase/auth'

import { getProfile } from './discord'

export default async function getUsersProfile(user: User) {

    const access_token = process.browser ? await getToken(user) : null
    return access_token ? getProfile(access_token) : null

}

async function getToken(user: User) {

    const { claims } = await user.getIdTokenResult()
    const { access_token } = claims

    return typeof access_token === 'string' ? access_token : null

}