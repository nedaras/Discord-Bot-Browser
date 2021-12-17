import type { NextApiRequest, NextApiResponse } from 'next'

import type Video from '../../../@types/video'
import type { ApiResponse } from '../../../@types/apiResponse'

import { fetchData } from '../../../utils/fetch-data'

import { youtube_api_key as key } from '../../../keys.json'

interface Query {
    [key: string]: string | string[]
    id: string

}

interface Snippet {
    title: string
    thumbnails: {
        standard: {
            url: string
            width: number
            height: number

        }

    }

}

interface YoutubeApiResponse { 
    items: [ { snippet: Snippet } ] | [ undefined ]

}

export default async function handler(request: NextApiRequest, response: NextApiResponse<ApiResponse<Video>>) {

    const { id } = request.query as Query
    const url = `https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${id}&key=${key}`

    console.log(`[pages/video/[id].ts] --> Incomming request with video id of: ${id}`);

    const data = (await fetchData<YoutubeApiResponse>(url).catch(() => ({ items: [] }))).items[0]

    if (data) return response.json({
        title: data.snippet.title,
        image_src: data.snippet.thumbnails.standard.url

    })

    response.status(404).json({
        status: 404,
        message: 'Video was not found'

    })

}