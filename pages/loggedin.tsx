import type { NextPage } from 'next'

import { FC, Suspense } from 'react'

import { auth } from '../utils/firebase'
import { signInWithCustomToken } from 'firebase/auth'

import type { PromiseSuspender } from '../utils/suspend-promise'
import suspendPromise from '../utils/suspend-promise'

import cookie from 'js-cookie'
import Link from 'next/link'

interface ContentProps {
    loginSuspender: PromiseSuspender<string | null>

}

const Page: NextPage = () => {

    return <Suspense fallback='trying to login' >
        <Content loginSuspender={suspendPromise(loginWasSuccessfull)} />
    </Suspense>

}

const Content:FC<ContentProps> = ({ loginSuspender: { call } }) => {

    const guild = call()

    return guild ? <div>
        you have successfully logged in <br />

        <button><Link href={`/dashboard/${guild}`} >Continue</Link></button>

    </div> : <div>
        Weird error has accured!

    </div>

}

async function loginWasSuccessfull() {

    const token = cookie.get('token')
    const guild = cookie.get('guild')

    if (token && guild) {

        const success = await signInWithCustomToken(auth, token).then(() => true).catch(() => false)

        cookie.remove('token')
        cookie.remove('guild')

        return success ? guild : null

    }
    return null

}

export default Page