import type { NextApiRequest, NextApiResponse } from 'next'

import type { JsonObject } from '../../../@types'
import type { ResponseError } from '../../../@types/apiResponse'

import { firestore } from '../../../utils/firebase-admin'

export default async function handler(request: NextApiRequest, response: NextApiResponse<ResponseError | { success: true }>) {

    const { document_id, user_id, access_token } = request.body as JsonObject<string | undefined>

    if (request.method?.toUpperCase() !== 'POST') return response.status(404).json({ status: 400, message: 'only accpets "POST" requests' })
    if (!(document_id && user_id && access_token)) return response.status(404).json({ status: 400, message: 'missing some fields' })

    if (access_token === (await firestore.doc(`/users/${user_id}`).get()).data()?.access_token) {

        firestore.doc(`/songs/${document_id}`).delete()

        return response.status(200).json({ success: true })

    }

    response.status(400).json({
        status: 400,
        message: 'unauthorized'

    })

}