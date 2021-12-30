import type { NextPage } from 'next'
import { useRouter } from 'next/router'

import type { FC } from 'react'
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

import cookie from 'js-cookie'

interface ContentProps {
    profileSuspender: PromiseSuspender<[ string | undefined, string | null, DiscordProfile | null ]>

}

const Page: NextPage = () => {

    return <Suspense fallback='Loading'>
        <Content profileSuspender={suspendPromise(currentUser)} />
    </Suspense>

}

const Content:FC<ContentProps> = ({ profileSuspender: { call } }) => {

    const router = useRouter()
    const [ user_id, access_token, profile ] = call()

    const songsData = useSongsData()

    // ! u should only be logged in if u want to add music, but if u just want to inspect then u should be good to go
    if (!(user_id && access_token && profile)) {

        cookie.set('guild', router.query.guild as string, {
            expires: 1 / 24 / 60,
            sameSite: 'strict',
            path: '/'

        })

        router.push('/login')
        return null

    }

    return <div>
        <SearchBar onSongAdd={(id) => postData('http://localhost:3000/api/songs/create', { video_id: id, user_id, access_token }) } />
        { songsData && <Queue songs={songsData} songRemoved={(id) => postData('http://localhost:3000/api/songs/remove', { document_id: id, user_id, access_token })} /> }

    </div>

}

async function currentUser(): Promise<[ string | undefined, string | null, DiscordProfile | null ]> {

    const user = await getCurrentUser()
    const accessToken = user ? await getToken(user) : null
    const profile = accessToken ? await getProfile(accessToken) : null

    return [ user?.uid, accessToken, profile ]

}

async function getToken(user: User) {

    const { claims } = await user.getIdTokenResult()
    const { access_token } = claims

    return typeof access_token === 'string' ? access_token : null

}

export default Page