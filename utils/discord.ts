import { fetchData, postData } from './fetchData'

import auth from '../auth.json'

type JsonObject = { [key: string]: any }

interface DisocrdOAuth2Response {
    access_token: string
    expires_in: number
    refresh_token: string
    scope: number
    token_type: string

}

interface Profile {
    id: string
    username: string
    avatar: string
    email: string
    verified: boolean

}

interface ResponseError {
    error: string
    error_description: string

}

export async function getToken(code: string) {

    const data = {
        client_id: auth.client_id,
        client_secret: auth.client_secret,
        grant_type: 'authorization_code',
        code,
        redirect_uri: auth.encoded_redirect_uri,
        scope: 'identify%20guilds'

    }

    const response = await postData<DisocrdOAuth2Response | ResponseError>('https://discordapp.com/api/oauth2/token', data, 'x-www-form-urlencoded').catch(() => undefined)

    if (response && !isResponseAnError(response)) return response.access_token

}

export async function getProfile(token: string){

    const response = await fetchData<Profile | ResponseError>('https://discordapp.com/api/users/@me', `Bearer ${token}`).catch(() => undefined)

    if (response && !isResponseAnError(response)) return response

}

const isResponseAnError = (response: JsonObject): response is ResponseError => (response as ResponseError).error != undefined