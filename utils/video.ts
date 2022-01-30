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

export const getVideo = (input: string) => suspendPromise(() => fetchData<ApiResponse<Video>>(getURL(input)).catch(() => responseFailed))

function getURL(input: string) {
	const id = getVideoId(input)

	if (id) return `http://localhost:3000/api/youtube/video?id=${id}`
	return `http://localhost:3000/api/youtube/search?query=${input}`
}

function getVideoId(url: string) {
	const regex = /(http|https):\/\/(www\.)?(youtube\.com)\/watch\?v=(\S{11})(\S+)?/
	if (regex.test(url)) return url.match(regex)![4]
}
