import type { CSSProperties, FC } from 'react'
import { Suspense, useState, useRef, useEffect } from 'react'

import type { ApiResponse, ResponseError } from '../@types/apiResponse'

import type { VideoSuspender } from '../utils/video'
import { getVideo, getVideoId } from '../utils/video'

import styles from '../styles/SearchBar.module.scss'

interface Props {}
interface ResultProps { input: string }
interface FetcherProps { video: VideoSuspender }

const SearchBar: FC<Props> = () => {

    const input = useRef<HTMLInputElement>(null)
    const [ value, setValue ] = useState('')

    const border = { borderRadius: value === '' ? '1rem' : '1rem 1rem 0 0' }

    return <div className={styles['search-bar']} >
        <input  style={border} placeholder='Put url of the youtube video...' onChange={() => setValue(input.current!.value.replace(/\s/g, '')) } ref={input} />
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
        
        return suspender ? <Suspense fallback={<div className={styles['response']} >...</div>} >
            <Fetcher video={suspender} />
        </Suspense> : <div className={styles['response']} >We only accept Youtube URLs</div>

    }
    return null

}

const Fetcher: FC<FetcherProps> = ({ video }) => {

    const data = video.call()

    if (isResponseAnError(data)) return <div className={styles['response']} >{ data.message }</div>

    return <div className={styles['image-response']} style={{ backgroundImage: `url('${data.imageSource}')` }}  >
        <div>{ data.title }</div>

    </div>

}

function isResponseAnError<T>(response: ApiResponse<T>): response is ResponseError {

    return (response as ResponseError).status !== undefined

}

export default SearchBar