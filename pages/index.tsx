import type { NextPage } from 'next'

import Link from 'next/link'

import discord_auth from '../auth.json'

import useAuth from '../hooks/useAuth'

interface Props {
    jwt: string | null

}

const Home: NextPage<Props> = () => {

    const user = useAuth()

    return <>
        <Link href={`https://discordapp.com/api/oauth2/authorize?client_id=${discord_auth.client_id}&redirect_uri=${discord_auth.encoded_redirect_uri}&response_type=code&scope=identify%20guilds`} >Log in</Link>

    </>
}

export default Home
