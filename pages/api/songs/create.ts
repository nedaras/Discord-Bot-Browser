import type { NextApiRequest, NextApiResponse } from 'next'

import type Video from '../../../@types/video'
import type { JsonObject } from '../../../@types'
import type { ApiResponse, ResponseError } from '../../../@types/apiResponse'

import { firestore } from '../../../utils/firebase-admin'
import { FieldValue } from 'firebase-admin/firestore'

import { fetchData } from '../../../utils/fetch-data'

export default async function handler(request: NextApiRequest, response: NextApiResponse<ResponseError | { success: true }>) {

    const { video_id, user_id, access_token } = request.body as JsonObject<string | undefined>

    if (request.method?.toUpperCase() !== 'POST') return response.status(404).json({ status: 400, message: 'only accpets "POST" requests' })
    if (!(video_id && user_id && access_token)) return response.status(404).json({ status: 400, message: 'missing some fields' })
    
    const video = await fetchData<ApiResponse<Video>>(`http://localhost:3000/api/video?id=${video_id}`)

    if (isResponseAnError(video)) return response.status(video.status).json(video)
    if (access_token === (await firestore.doc(`/users/${user_id}`).get()).data()?.access_token) {

        firestore.collection('songs').add({
            id: video_id,
            title: video.title,
            author: video.channel_title,
            created_at: FieldValue.serverTimestamp()

        })

        return response.status(200).json({ success: true })

    }

    response.status(400).json({
        status: 400,
        message: 'unauthorized'

    })

}

const isResponseAnError = (response: JsonObject | ResponseError): response is ResponseError => (response as ResponseError).status !== undefined