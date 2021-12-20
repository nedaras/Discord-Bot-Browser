import type { NextPage } from 'next'
import Link from 'next/link'

import auth from '../auth.json'

const Page: NextPage = () => {

    return <div>
        It seems ur not loggedin <br />
        <button><Link href={`https://discordapp.com/api/oauth2/authorize?client_id=${auth.client_id}&redirect_uri=${auth.encoded_redirect_uri}&response_type=code&scope=${auth.encoded_scopes}`} >Log in</Link></button>

    </div>

}

export default Page