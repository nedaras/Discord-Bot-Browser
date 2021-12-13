import type { FC } from 'react'

import type { ApiResponse, ResponseError } from '../@types/apiResponse'
import type Video from '../@types/video'

import type { PromiseSuspender } from '../hooks/useSuspender'

import { Suspense, useState, useRef } from 'react'

import useSuspender from '../hooks/useSuspender'
import fetchData from '../utils/fetchData'

interface Props {}
interface ResponseProps {
    videoSuspender: PromiseSuspender<ApiResponse<Video>>

} 

const SearchBar: FC<Props> = () => {

    const [ serouce, setResource ] = useState(() => getVideo('iX-QaNzd-0Y'))
    const input = useRef<HTMLInputElement>(null)

    return <div>
        <input placeholder='Put the id of the video...' ref={input} />
        <Suspense fallback='Loading...'>
            <Response videoSuspender={serouce} />
        </Suspense>
        <button onClick={() => input.current && setResource(getVideo(input.current.value))} >Refresh data</button>
    </div>

}

const Response: FC<ResponseProps> = ({ videoSuspender }) => {

    const data = videoSuspender.call()

    return <p>{ JSON.stringify(data) }</p>

}

function getVideo(id: string) {    

    const response = fetchData<Video>(`http://localhost:3000/api/video/${id}`).catch(() => ({
        status: 500,
        message: 'invalid url | bad url passed or youtube is offline'

    }) as ResponseError)

    return useSuspender(() => response)

}

export default SearchBar