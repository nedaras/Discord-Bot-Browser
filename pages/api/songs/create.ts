import type { NextApiRequest, NextApiResponse } from 'next'

import type Video from '../../../@types/video'
import type { JsonObject } from '../../../@types'
import type { ApiResponse, ResponseError } from '../../../@types/apiResponse'

import { firestore } from '../../../utils/firebase-admin'
import { FieldValue } from 'firebase-admin/firestore'

import { fetchData, postData } from '../../../utils/fetch-data'
import { getProfile } from '../../../utils/discord'

export default async function handler(request: NextApiRequest, response: NextApiResponse<ResponseError | { success: true }>) {

    const { video_id, user_id, access_token, guild_id } = request.body as JsonObject<string | undefined>

    if (request.method?.toUpperCase() !== 'POST') return response.status(404).json({ status: 400, message: 'only accpets "POST" requests' })
    if (!(video_id && user_id && access_token && guild_id)) return response.status(404).json({ status: 400, message: 'missing some fields' })
    
    const voice = await postData('http://localhost:4000/api/user', { guild_id, user_id})
    if (isResponseAnError(voice)) return response.status(voice.status).json(voice)
    const video = await fetchData<ApiResponse<Video>>(`http://localhost:3000/api/video?id=${video_id}`)
    if (isResponseAnError(video)) return response.status(video.status).json(video)

    if (access_token === (await firestore.doc(`/users/${user_id}`).get()).data()?.access_token) {

        const profile = await getProfile(access_token)

        if (profile) {

            firestore.collection('songs').add({
                guild_id,
                user_id: profile.id,
                video_id: video_id,
                video_title: video.title,
                video_author: video.channel_title,
                created_at: FieldValue.serverTimestamp()
    
            })
    
            return response.status(200).json({ success: true })

        }

    }

    response.status(400).json({
        status: 400,
        message: 'unauthorized'

    })

}

const isResponseAnError = (response: JsonObject | ResponseError): response is ResponseError => (response as ResponseError).status !== undefined