import type { NextPage, NextApiRequest } from 'next'

import { useRouter } from 'next/router'

import SearchBar from '../components/SearchBar'

import discord_auth from '../auth.json'

import { auth } from '../utils/firebase'

import { signInWithCustomToken, signOut } from 'firebase/auth'
import { useAuthState } from 'react-firebase-hooks/auth'

import { useEffect } from 'react'
import Link from 'next/link'

interface Props {
    jwt: string | null

}

const Home: NextPage<Props> = ({ jwt }) => {

    const router = useRouter()
    const [ user, loading, error ] = useAuthState(auth)
    
    console.log(user)
    

    useEffect(() => {

        jwt && signInWithCustomToken(auth, jwt).catch((err) => console.log(err))

    }, [])

    if (!loading && user) return <>
        Welcome { user.displayName } how is your day?
        <button onClick={() => signOut(auth)} >Log out</button>

    </>

    return <>
        <p>It seems ur not loged id!</p>
        <Link href={`https://discordapp.com/api/oauth2/authorize?client_id=${discord_auth.client_id}&redirect_uri=${discord_auth.encoded_redirect_uri}&response_type=code&scope=identify%20guilds`} >Log in</Link>

    </>
}

export async function getServerSideProps(request: NextApiRequest) {

    console.log(request.cookies)
    

    return { props: { jwt: request.query.login || null } }
    

}

export default Home
