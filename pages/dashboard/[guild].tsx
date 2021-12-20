import type {NextPage } from 'next'
import { useRouter } from 'next/router'

import type { FC } from 'react'
import { Suspense } from 'react'

import type { DiscordProfile } from '../../@types/discord'

import getUsersProfile from '../../utils/get-users-profile'
import type { PromiseSuspender } from '../../utils/suspend-promise'
import suspendPromise from '../../utils/suspend-promise'

import { auth, getCurrentUser } from '../../utils/firebase'
import { signOut } from 'firebase/auth'

import cookie from 'js-cookie'

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

    return <div>
        Welcome { profile.username } <br />
        <button onClick={() => signOut(auth)} >Log out</button>

    </div>

}

async function getCurrentUserProfile() {

    const user = await getCurrentUser()
    return user ? getUsersProfile(user) : null

}

export default Page