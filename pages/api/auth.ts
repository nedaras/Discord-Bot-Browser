import type { NextApiRequest, NextApiResponse } from 'next'

import type { ApiResponse } from '../../@types/apiResponse'

import { getProfile, getToken } from '../../utils/discord'

import service from '../../firebase-service.json'

import admin from 'firebase-admin'

interface Query {
    [key: string]: string | undefined | (string | undefined)[]
    code: string | undefined

}

interface AuthResponse {
    uid: string
    username: string
    email: string
    token: string

}

admin.initializeApp({ credential: admin.credential.cert(service as any) })

export default async function handler(request: NextApiRequest, response: NextApiResponse<ApiResponse<AuthResponse>>) {

    const { code } = request.query as Query

    if (!code) return response.status(400).json({
        status: 400,
        message: '"code" was not passed in'

    })

    const token = await getToken(code)
    const profile = token ? await getProfile(token) : undefined

    if (profile) {

        const user: AuthResponse = {
            uid: profile.id,
            username: profile.username,
            email: profile.email,
            token: token!

        }

        try {

            admin.auth().createUser(user)
            admin.firestore().doc(`/users/${user.uid}`).set(user)

            response.json(user)

        } catch(error) {

            response.status(500).json({
                status: 500,
                message: error as string

            })

        }

        return

    }

    response.status(400).json({
        status: 400,
        message: 'invalid code'

    })

}