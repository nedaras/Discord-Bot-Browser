import type { NextPage } from 'next'
import Link from 'next/link'

const Page: NextPage = () => {

    return <div>
        It seems ur not loggedin <br />
        <button><Link href={`https://discordapp.com/api/oauth2/authorize?client_id=${process.env.NEXT_PUBLIC_DISCORD_CLIENT_ID}&redirect_uri=${process.env.NEXT_PUBLIC_DISCORD_OAUTH2_ENCODED_REDIRECT_URI}&response_type=code&scope=${process.env.NEXT_PUBLIC_DISCORD_OAUTH2_ENCODED_SCOPES}`} >Log in</Link></button>

    </div>

}

export default Page