import type Video from '../@types/video'
import type { ApiResponse, ResponseError } from '../@types/apiResponse'

import type { PromiseSuspender } from './suspend-promise'

import suspendPromise from './suspend-promise'
import { fetchData } from './fetch-data'

export type VideoSuspender = PromiseSuspender<ApiResponse<Video>>

const responseFailed: ResponseError = {
	status: 500,
	message: 'server cant fetch api',
}

export const getVideo = (id: string) =>
	suspendPromise(() =>
		fetchData<ApiResponse<Video>>(
			`http://localhost:3000/api/video?id=${id}`
		).catch(() => responseFailed)
	)

export function getVideoId(url: string) {
	const regex =
		/(http|https):\/\/(www\.)?(youtube\.com)\/watch\?v=(\S{11})(\S+)?/
	if (regex.test(url)) return url.match(regex)![4]
}
