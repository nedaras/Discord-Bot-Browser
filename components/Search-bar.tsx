import { FC } from 'react'
import { Suspense, useState, useRef, useEffect } from 'react'

import type { JsonObject } from '../@types'
import type { ResponseError } from '../@types/apiResponse'

import type { VideoSuspender } from '../utils/video'
import { getVideo } from '../utils/video'

import styles from '../styles/Search-bar.module.scss'
import useDebounce from '../hooks/use-debounce'

interface Props {
	songAdded: (id: string) => void
}
interface ResultProps {
	video: VideoSuspender
	songAddEvent: (id: string) => void
}

const SearchBar: FC<Props> = ({ songAdded }) => {
	const input = useRef<HTMLInputElement>(null)
	const [value, setValue] = useState('')
	const [video, setVideo] = useState<VideoSuspender | null>(null)

	useDebounce(
		() => {
			setVideo(value ? getVideo(value) : null)
		},
		500,
		[value]
	)

	const songAddEvent = (id: string) => {
		songAdded(id)

		input.current!.value = ''
		setValue('')
		setVideo(null)
	}

	const border = { borderRadius: video && value ? '1rem 1rem 0 0' : '1rem' }

	return (
		<div className={styles['search-bar']}>
			<input style={border} placeholder="Search..." onChange={() => setValue(input.current!.value)} ref={input} />
			{video && value && (
				<Suspense fallback={<div className={styles['response']}>...</div>}>
					<Result video={video} songAddEvent={(id) => songAddEvent(id)} />
				</Suspense>
			)}
		</div>
	)
}

const Result: FC<ResultProps> = ({ video: { call }, songAddEvent }) => {
	const data = call()

	useEffect(() => {
		const eventHandler = (event: KeyboardEvent) => event.keyCode === 13 && !isResponseAnError(data) && songAddEvent(data.video_id)

		window.addEventListener('keydown', eventHandler)
		return () => window.removeEventListener('keydown', eventHandler)
	}, [])

	return isResponseAnError(data) ? (
		<div className={styles['response']}>{data.message}</div>
	) : (
		<div className={styles['image-response']} style={{ backgroundImage: `url('${data.image_src}')` }}>
			<div>{data.title}</div>
		</div>
	)
}

const isResponseAnError = (response: JsonObject | ResponseError): response is ResponseError => (response as ResponseError).status !== undefined

export default SearchBar
