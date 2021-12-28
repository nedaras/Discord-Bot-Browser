import type { NextPage } from 'next'

import { FC, useEffect } from 'react'

import type Video from '../@types/video'
import useSongs from '../hooks/useSongs'

import styles from '../styles/Queue.module.scss'

interface SongsProps {
    title: string
    author: string

}

const Queue: NextPage = () => {

    const songsData = useSongs('')

    if (!songsData) return null

    return <div className={styles.queue} >
        { songsData.map(({ title, author }, index) => <Song key={index} title={title} author={author} ></Song>) }

    </div>

}

const Song: FC<SongsProps> = ({ title, author }) => {

    return <div>
        { title }
        <p>{ author }</p>
    </div>

}

export default Queue