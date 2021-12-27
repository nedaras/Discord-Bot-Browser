import type { NextPage } from 'next'

import type { FC } from 'react'

import type Video from '../@types/video'

import styles from '../styles/Queue.module.scss'

interface Props { songs: Video[] }
interface SongsProps {
    title: string
    author: string

}

const Queue: NextPage<Props> = ({ songs }) => {

    return <div className={styles.queue} >

        { songs.map(({ title, image_src }, index) => <Song key={index} title={title} author={image_src} ></Song>) }

    </div>

}

const Song: FC<SongsProps> = ({ title, author }) => {

    return <div>
        { title }
        <p>{ author }</p>
    </div>

}

export default Queue