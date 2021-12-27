import type {NextPage } from 'next'
import { useRouter } from 'next/router'

import type { FC } from 'react'
import { Suspense } from 'react'

import type { DiscordProfile } from '../../@types/discord'
import type Video from '../../@types/video'

import getUsersProfile from '../../utils/get-users-profile'
import type { PromiseSuspender } from '../../utils/suspend-promise'
import suspendPromise from '../../utils/suspend-promise'

import { auth, getCurrentUser } from '../../utils/firebase'
import { signOut } from 'firebase/auth'

import cookie from 'js-cookie'
import SearchBar from '../../components/SearchBar'
import Queue from '../../components/Queue'

interface ContentProps {
    profileSuspender: PromiseSuspender<DiscordProfile | null>

}

const songs: Video[] = [
    { 
        title: 'DIOR',
        image_src: 'REV'
    },
    { 
        title: 'Princess Bubblegum',
        image_src: 'haroinfather – tema'
    },
    { 
        title: 'Gassed Up',
        image_src: 'Nebu Kiniza'
    }

]

const Page: NextPage = () => {

    return <Suspense fallback='Loading'>
        <div>
            <Content profileSuspender={suspendPromise(getCurrentUserProfile)} />
            <Queue songs={songs} />
        </div>
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

    return <div>
        <SearchBar onSongAdd={(url) => console.log(url)} />

    </div>

}

async function getCurrentUserProfile() {

    const user = await getCurrentUser()
    const profile = user ? getUsersProfile(user) : null

    return profile

}

export default Page