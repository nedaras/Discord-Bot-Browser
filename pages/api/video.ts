import type { NextApiRequest, NextApiResponse } from 'next'

import { JsonObject } from '../../@types'
import type Video from '../../@types/video'
import type { ApiResponse } from '../../@types/apiResponse'

import { fetchData } from '../../utils/fetch-data'

interface Snippet {
    title: string
    channelTitle: string
    thumbnails: {
        default: {
            url: string
            width: number
            height: number

        }

    }

}

type YoutubeApiResponse = { items: [ { snippet: Snippet } ] | [ undefined ] }

export default async function handler(request: NextApiRequest, response: NextApiResponse<ApiResponse<Video>>) {

    const { id } = request.query as JsonObject<string | undefined>

    if (id) {

        const url = `https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${id}&key=${process.env.YOUTUBE_API_KEY}`
        const data = (await fetchData<YoutubeApiResponse>(url).catch(() => ({ items: [] }))).items[0]

        if (data) return response.json({
            title: data.snippet.title,
            channel_title: data.snippet.channelTitle,
            image_src: data.snippet.thumbnails.default.url
    
        })
    
        return response.status(404).json({
            status: 404,
            message: 'video was not found'
    
        })

    }

    response.status(404).json({
        status: 400,
        message: 'field of "id" was not passed in'

    })

}