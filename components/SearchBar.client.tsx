import type { FC } from 'react'

import type { ApiResponse, ResponseError } from '../@types/apiResponse'
import type Video from '../@types/video'

import type { PromiseSuspender } from '../utils/suspendPromise'

import { Suspense, useState, useRef } from 'react'

import suspendPromise from '../utils/suspendPromise'
import fetchData from '../utils/fetchData'

interface Props {}
interface ResultProps {
    videoSuspender: PromiseSuspender<ApiResponse<Video>>

} 

const SearchBar: FC<Props> = () => {

    const [ id, setId ] = useState(() => getVideo('iX-QaNzd-0Y'))
    const input = useRef<HTMLInputElement>(null)

    return <div>
        <input placeholder='Put the id of the video...' ref={input} />
        <Suspense fallback='Loading...'>
            <Result videoSuspender={id} />
        </Suspense>
        <button onClick={() => input.current && setId(getVideo(input.current.value))} >Refresh data</button>
    </div>

}

const Result: FC<ResultProps> = ({ videoSuspender }) => {

    const data = videoSuspender.call()

    return <p>{ JSON.stringify(data) }</p>

}

const getVideo = (id: string) => suspendPromise(() => fetchData<Video>(`http://localhost:3000/api/video/${id}`).catch(() => ({
    status: 500,
    message: 'invalid url | bad url passed or youtube is offline'

}) as ResponseError))

export default SearchBar