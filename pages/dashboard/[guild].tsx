import type { NextPage } from 'next'

import { FC, useState } from 'react'
import { Suspense } from 'react'

import type { DiscordProfile } from '../../@types/discord'

import type { PromiseSuspender } from '../../utils/suspend-promise'
import { getProfile } from '../../utils/discord'
import suspendPromise from '../../utils/suspend-promise'
import { postData } from '../../utils/fetch-data'

import { getCurrentUser } from '../../utils/firebase'
import { User } from 'firebase/auth'

import useSongsData from '../../hooks/use-songs-data'

import SearchBar from '../../components/Search-bar'
import Queue from '../../components/Queue'

import Login from '../../components/Login'
import { AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/router'
import { ApiResponse, ResponseError } from '../../@types/apiResponse'
import { JsonObject } from '../../@types'
import Header from '../../components/Header'
import Profile from '../../components/Profile'
import Notification from '../../components/Notification'

interface ContentProps {
	profileSuspender: PromiseSuspender<[string | undefined, string | null, DiscordProfile | null]>
}

const Page: NextPage = () => {
	return (
		<Suspense fallback="Loading">
			<Content profileSuspender={suspendPromise(currentUser)} />
		</Suspense>
	)
}

const Content: FC<ContentProps> = ({ profileSuspender: { call } }) => {
	const [showLogin, setLogin] = useState(false)
	const [notification, setNotification] = useState<string | null>(null)

	const [user_id, access_token, profile] = call()

	const router = useRouter()

	const songs = useSongsData(router.query.guild as string)

	async function handleError(promise: ApiResponse<JsonObject>) {
		const response = await promise

		if (!isResponseAnError(response)) return

		const { message } = response

		;(message === 'unauthorized' || message === 'missing some fields') && setLogin(true)
		message === 'voice channel not found' && setNotification('You need to be in a voice channel!')
		message === 'fetch failed' && setNotification('It seems that Muzikyte bot is turned off at the moment')
	}

	const addSong = (id: string) => {
		handleError(
			postData('http://localhost:3000/api/songs/create', {
				video_id: id,
				user_id,
				access_token,
				guild_id: router.query.guild,
			})
		)
	}
	const removeSong = (id: string) => {
		handleError(
			postData('http://localhost:3000/api/songs/remove', {
				document_id: id,
				user_id,
				access_token,
			})
		)
	}

	return (
		<>
			<Header>
				<SearchBar songAdded={addSong} />
				<Profile profile={profile}></Profile>
			</Header>

			{songs && <Queue songs={songs} songRemoved={removeSong} />}

			<AnimatePresence initial={false} exitBeforeEnter={true}>
				{showLogin && <Login onClose={() => setLogin(false)} />}
			</AnimatePresence>
			<Notification onTimeout={() => setNotification(null)}>{notification}</Notification>
		</>
	)
}

async function currentUser(): Promise<[string | undefined, string | null, DiscordProfile | null]> {
	const user = await getCurrentUser()
	const accessToken = user ? await getToken(user) : null
	const profile = accessToken ? await getProfile(accessToken) : null

	return [user?.uid, accessToken, profile]
}

async function getToken(user: User) {
	const { claims } = await user.getIdTokenResult()
	const { access_token } = claims

	return typeof access_token === 'string' ? access_token : null
}

const isResponseAnError = (response: JsonObject | ResponseError): response is ResponseError => (response as ResponseError).status !== undefined

export default Page
