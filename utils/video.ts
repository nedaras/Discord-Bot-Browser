import type Video from '../@types/video'
import type { ApiResponse, ResponseError } from '../@types/apiResponse'

import type { PromiseSuspender } from './suspendPromise'

import suspendPromise from './suspendPromise'
import { fetchData } from './fetchData'

export type VideoSuspender = PromiseSuspender<ApiResponse<Video>>

export const getVideo = (id: string) => suspendPromise(() => fetchData<ApiResponse<Video>>(`http://localhost:3000/api/video/${id}`).catch(() => ({
    status: 500,
    message: 'server cant fetch api'

}) as ResponseError))

export function getVideoId(url: string) {

    const regex = /(http|https):\/\/(www\.)?(youtube\.com)\/watch\?v=(\S{11})(\S+)?/
    return regex.test(url) ? url.match(regex)![4] : undefined

}