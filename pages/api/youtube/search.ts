import type { NextApiRequest, NextApiResponse } from 'next'

import { JsonObject } from '../../../@types'
import type Video from '../../../@types/video'
import type { ApiResponse } from '../../../@types/apiResponse'
import type { SearchApiResponse, ErrorApiResponse } from '../../../@types/youtube'

import { fetchData } from '../../../utils/fetch-data'

export default async function handler(request: NextApiRequest, response: NextApiResponse<ApiResponse<Video>>) {
	const { query } = request.query as JsonObject<string | undefined>

	if (query) {
		const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&q=${query}&key=${process.env.YOUTUBE_API_KEY}`
		const apiResponse = await fetchData<SearchApiResponse | ErrorApiResponse>(url).catch(() => ({
			items: [],
		}))

		if (isResponseAnError(apiResponse))
			return response.json({
				status: apiResponse.error.code,
				message: 'uncaught error',
			})

		const data = apiResponse.items[0]

		if (data)
			return response.json({
				title: data.snippet.title,
				channel_title: data.snippet.channelTitle,
				image_src: data.snippet.thumbnails.default.url,
				video_id: data.id.videoId,
			})

		return response.status(404).json({
			status: 404,
			message: 'video was not found',
		})
	}

	response.status(404).json({
		status: 400,
		message: 'field of "query" was not passed in',
	})
}

const isResponseAnError = (response: JsonObject | ErrorApiResponse): response is ErrorApiResponse => (response as ErrorApiResponse).error !== undefined
