import { FC } from 'react'
import { Suspense, useState, useRef, useEffect } from 'react'

import type { JsonObject } from '../@types'
import type { ResponseError } from '../@types/apiResponse'

import type { VideoSuspender } from '../utils/video'
import { getVideo, getVideoId } from '../utils/video'

import styles from '../styles/Search-bar.module.scss'

interface Props { songAdded: (id: string) => void }
interface ResultProps { input: string, songAddEvent: (id: string) => void }
interface FetcherProps { video: VideoSuspender, songAddEvent: () => void }

const SearchBar: FC<Props> = ({ songAdded }) => {

    const input = useRef<HTMLInputElement>(null)
    const [ value, setValue ] = useState('')

    const border = { borderRadius: value === '' ? '1rem' : '1rem 1rem 0 0' }

    const songAddEvent = (id: string) => {

        songAdded(id)

        input.current!.value = ''
        setValue('')
    
    }

    return <div className={styles['search-bar']} >
        <input  style={border} placeholder='Put url of the youtube video...' onChange={() => setValue(input.current!.value.replace(/\s/g, '')) } ref={input} />
        <Result input={value} songAddEvent={songAddEvent} />
    </div>

}

const Result: FC<ResultProps> = ({ input, songAddEvent }) => {

    const [ { id, suspender }, setVideo ] = useState<{ id: string | null, suspender: VideoSuspender | null }>({ 
        id: null, 
        suspender: null

    })

    useEffect(() => {  

        if (input !== '') {

            const videoId = getVideoId(input)

            if (videoId && videoId !== id) setVideo({ id: videoId, suspender: getVideo(videoId) })
            else if (!videoId) setVideo({ id: videoId || null, suspender: null })

            return

        }
        setVideo({ id: null, suspender: null })

    }, [ input ])

    if (input !== '') {
        
        return suspender ? <Suspense fallback={<div className={styles['response']} >...</div>} >
            <Fetcher video={suspender} songAddEvent={() => songAddEvent(id!)} />
        </Suspense> : <div className={styles['response']} >We only accept Youtube URLs</div>

    }
    return null

}

const Fetcher: FC<FetcherProps> = ({ video: { call }, songAddEvent }) => {

    const data = call()

    useEffect(() => {

        const eventHandler = (event: KeyboardEvent) => event.keyCode === 13 && !isResponseAnError(data) && songAddEvent()

        window.addEventListener('keydown', eventHandler)
        return () => window.removeEventListener('keydown', eventHandler)

    }, [])

    if (isResponseAnError(data)) return <div className={styles['response']} >{ data.message }</div>

    return <div className={styles['image-response']} style={{ backgroundImage: `url('${data.image_src}')` }}  >
        <div>{ data.title }</div>

    </div>

}

const isResponseAnError = (response: JsonObject | ResponseError): response is ResponseError => (response as ResponseError).status !== undefined

export default SearchBar