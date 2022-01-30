import { firestore } from '../utils/firebase'
import { onSnapshot, query, collection, orderBy, where } from 'firebase/firestore'
import { useEffect, useState } from 'react'

import Song from '../@types/song'

export default function useSongs(guild: string) {
	const [songs, setSongs] = useState<Song[] | null>(null)

	useEffect(() => {
		onSnapshot(query(collection(firestore, 'songs'), where('guild_id', '==', guild), orderBy('created_at')), (songs) => {
			const songsArray: Song[] = []
			songs.forEach((song) =>
				songsArray.push({
					document_id: song.id,
					...song.data(),
				} as Song)
			)

			setSongs(songsArray)
		})
	}, [])

	return songs
}
