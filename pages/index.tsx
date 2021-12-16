import type { NextPage } from 'next'

import SearchBar from '../components/SearchBar'

import auth from '../auth.json'

const Home: NextPage = () => {

    return <>
        <a href={`https://discordapp.com/api/oauth2/authorize?client_id=${auth.client_id}&redirect_uri=${auth.encoded_redirect_uri}&response_type=code&scope=identify%20guilds`} >Login</a>
        <SearchBar />
    </>
}

export default Home
