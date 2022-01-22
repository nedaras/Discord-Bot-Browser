import type { FC, MouseEventHandler } from 'react'

import type Song from '../@types/song'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrash } from '@fortawesome/free-solid-svg-icons'

import styles from '../styles/Queue.module.scss'

import { motion, AnimatePresence } from 'framer-motion'

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
        <AnimatePresence initial={false} >
            { songs.map(({ document_id, title, author }) => 
                <SongContainer key={document_id} handleRemove={() => songRemoved(document_id)} title={title} author={author} />) 
            }
        </AnimatePresence>
    </div>

}

const SongContainer: FC<SongsProps> = ({ handleRemove, title, author }) => {

    return <motion.div
            className={styles['box-container']}

            initial={{ x: '-100%' }} 
            animate={{ x: 0 }} 
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 400, damping: 25 }} 
        >
        <div>
            { title }
            <p>{ author }</p>
        </div>
        <FontAwesomeIcon icon={faTrash} onClick={handleRemove} />
    </motion.div>

}

export default Queue