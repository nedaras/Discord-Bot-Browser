import type { FC, MouseEventHandler } from 'react'

import type Song from '../@types/song'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrash } from '@fortawesome/free-solid-svg-icons'

import styles from '../styles/Queue.module.scss'

interface Props {
    songs: Song[]
    songRemoved: (id: string) => void

}
interface SongsProps {
    handleRemove: MouseEventHandler<SVGSVGElement>
    title: string
    author: string

}

const Queue: FC<Props> = ({ songs, songRemoved }) => {

    return <div className={styles.queue} >
        { songs.map(({ document_id, title, author }) => 
            <SongContainer key={document_id} handleRemove={() => songRemoved(document_id)} title={title} author={author} />) 
        }
    </div>

}

const SongContainer: FC<SongsProps> = ({ handleRemove, title, author }) => {

    return <div className={styles['box-container']} >
        <div>
            { title }
            <p>{ author }</p>
        </div>
        <FontAwesomeIcon icon={faTrash} onClick={handleRemove} />
    </div>

}

export default Queue