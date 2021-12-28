import type {NextPage } from 'next'
import { useRouter } from 'next/router'

import { FC, useState } from 'react'
import { Suspense } from 'react'

import type { DiscordProfile } from '../../@types/discord'
import type Video from '../../@types/video'

import getUsersProfile from '../../utils/get-users-profile'
import type { PromiseSuspender } from '../../utils/suspend-promise'
import suspendPromise from '../../utils/suspend-promise'

import { auth, getCurrentUser } from '../../utils/firebase'
import { signOut, User } from 'firebase/auth'

import cookie from 'js-cookie'
import SearchBar from '../../components/SearchBar'
import Queue from '../../components/Queue'
import { postData } from '../../utils/fetch-data'

interface ContentProps {
    profileSuspender: PromiseSuspender<DiscordProfile | null>

}

const Page: NextPage = () => {

    return <Suspense fallback='Loading'>
        <Content profileSuspender={suspendPromise(getCurrentUserProfile)} />
    </Suspense>

}

const Content:FC<ContentProps> = ({ profileSuspender: { call } }) => {

    const router = useRouter()
    const profile = call()

    if (!profile) {

        cookie.set('guild', router.query.guild as string, {
            expires: 1 / 24 / 60,
            sameSite: 'strict',
            path: '/'

        })

        router.push('/login')
        return null

    }

    async function addSong(id: string) {

        const user = await getCurrentUser()
        const access_token = user ? await getToken(user) : null

        access_token && postData('http://localhost:3000/api/songs/create', { video_id: id, user_id: user!.uid, access_token })

    }

    return <div>
        <SearchBar onSongAdd={addSong} />
        <Queue />

    </div>

}

async function getCurrentUserProfile() {

    const user = await getCurrentUser()
    return user ? getUsersProfile(user) : null

}

async function getToken(user: User) {

    const { claims } = await user.getIdTokenResult()
    const { access_token } = claims

    return typeof access_token === 'string' ? access_token : null

}

export default Page