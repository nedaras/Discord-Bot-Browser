import type { NextPage } from 'next'

import type { DiscordProfile } from '../@types/discord'

import Link from 'next/link'

import { Suspense } from 'react'

import SearchBar from '../components/SearchBar'

import discord_auth from '../auth.json'

import getUserProfile from '../utils/get-users-profile'
import suspendPromise, { PromiseSuspender } from '../utils/suspend-promise'

import { auth, getCurrentUser } from '../utils/firebase'
import { signInWithCustomToken, signOut } from 'firebase/auth'

import cookie from 'js-cookie'

interface PageProps {
    profileSuspender: PromiseSuspender<DiscordProfile | null>

}

const Home: NextPage = () => {

    return <Suspense fallback='Loading...'>
        <Page profileSuspender={suspendPromise(() => getCurrentUserProfile())} />

    </Suspense>

}

const Page: NextPage<PageProps> = ({ profileSuspender: { call } }) => {

    const profile = call()

    if (!profile) return <div>
        Nigga ur not logged in <br />
        <Link href={`https://discordapp.com/api/oauth2/authorize?client_id=${discord_auth.client_id}&redirect_uri=${discord_auth.encoded_redirect_uri}&response_type=code&scope=identify%20guilds`} >Log in</Link>
    </div>

    return <div>
        Welcome { profile.username } <br />
        <button onClick={() => signOut(auth)} >Sign out</button>
        
    </div>

}

export default Home

async function getCurrentUserProfile() {

    const token = cookie.get('token')
    let user = await getCurrentUser()

    if (token) {

        if (user) await signOut(auth)
        user = (await signInWithCustomToken(auth, token).catch(() => ({ user: null }))).user
        cookie.remove('token')

    }

    return user ? getUserProfile(user) : null

}