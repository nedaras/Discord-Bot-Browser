import { firestore } from '../utils/firebase'
import { onSnapshot, query, collection, orderBy } from 'firebase/firestore'
import { useEffect, useState } from 'react'

interface Song {
    id: string
    title: string
    author: string

}

export default function useSongs(guild: string) {

    const [ songs, setSongs ] = useState<Song[] | null>(null)

    useEffect(() => {
        
        onSnapshot(query(collection(firestore, 'songs'), orderBy('created_at')), (songs) => {

            const songsArray: Song[] = []
            songs.forEach((song) => songsArray.push(song.data() as Song))

            setSongs(songsArray)

        })

    }, [])

    return songs

}