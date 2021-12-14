import { FC } from 'react'

import type { ResponseError } from '../@types/apiResponse'

import type { VideoSuspender } from '../utils/video'

import { getVideo, getVideoId } from '../utils/video'

import { Suspense, useState, useRef, useEffect } from 'react'

interface Props {}
interface ResultProps { input: string }
interface FetcherProps { video: VideoSuspender }

const SearchBar: FC<Props> = () => {

    const input = useRef<HTMLInputElement>(null)
    const [ value, setValue ] = useState('')

    return <div>
        <input placeholder='Put the id of the video...' onChange={() => setValue(input.current!.value.replace(/\s/g, '')) } ref={input} />
        <Result input={value} />
    </div>

}

interface Video {
    id: string | undefined
    suspender: VideoSuspender | undefined

}

const Result: FC<ResultProps> = ({ input }) => {

    const [ { id, suspender }, setVideo ] = useState<Video>({ 
        id: undefined, 
        suspender: undefined 
    })

    useEffect(() => {  

        if (input !== '') {

            const videoId = getVideoId(input)

            if (videoId && videoId !== id) setVideo({ id: videoId, suspender: getVideo(videoId) })
            else if (!videoId) setVideo({ id: videoId, suspender: undefined })

            return

        }
        setVideo({ id: undefined, suspender: undefined })

    }, [ input ])

    if (input !== '') {
        
        return suspender ? <Suspense fallback='Loading...'>
            <Fetcher video={suspender} />
        </Suspense> : <p>Url Invalid</p>

    }
    return null

}

const Fetcher: FC<FetcherProps> = ({ video }) => {

    const data = video.call()

    console.log(data);
    

    return !isResponseAnError(data) ? <div>
        { data.title }
        <img src={data.imageSource} />
    </div> : <div>Error</div>

}

function isResponseAnError(response: any): response is ResponseError {

    return (response as ResponseError).status !== undefined

}

export default SearchBar