import type { NextApiRequest, NextApiResponse } from 'next'

import type Video from '../../../@types/video'
import type { ApiResponse } from '../../../@types/apiResponse'

import { toString as fetchData } from '../../../utils/fetchData'
import { load } from 'cheerio'

interface Query {
    [key: string]: string | string[]
    id: string

}

export default async function handler(request: NextApiRequest, response: NextApiResponse<ApiResponse<Video>>) {

    const { id } = request.query as Query
    console.log(`[pages/video/[id].ts] --> Incomming request with video id of: ${id}`);
    const url = `https://www.youtube.com/watch?v=${id}`

    const html = await fetchData(url).catch(() => undefined)
    const [ title, imageSource ] = html ? getParmas(html) : [ undefined, undefined ]

    if (html && title && imageSource) return response.json({
        title,
        imageSource

    })

    response.status(400).json({
        status: 400,
        message: 'id of the video is not valid'

    })

}

function getParmas(html: string): [ string | undefined, string | undefined ] {

    const $ = load(html)

    const title = $('meta[property="og:title"]').attr('content')
    const imageSource = $('meta[property="og:image"]').attr('content')

    return [ title, imageSource ]
    
}