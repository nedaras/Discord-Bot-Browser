import type { JsonObject } from '../@types'
import type { DiscordProfile } from '../@types/discord'

import { fetchData, postData } from './fetch-data'

import auth from '../auth.json'

interface DisocrdOAuth2Response {
    access_token: string
    expires_in: number
    refresh_token: string
    scope: string
    token_type: string

}

interface ResponseError {
    error: string
    error_description: string

}

export async function getToken(code: string): Promise<[ string, string ] | [ null, null ]> {

    const data = {
        client_id: auth.client_id,
        client_secret: auth.client_secret,
        grant_type: 'authorization_code',
        code,
        redirect_uri: auth.encoded_redirect_uri,
        scope: 'identify%20guilds'

    }

    const response = await postData<DisocrdOAuth2Response | ResponseError>('https://discordapp.com/api/oauth2/token', data, 'x-www-form-urlencoded').catch(() => undefined)
    

    if (response && !isResponseAnError(response)) return [ response.access_token, response.refresh_token ]
    return [ null, null ]

}

export async function getProfile(token: string){

    const response = await fetchData<DiscordProfile | ResponseError>('https://discordapp.com/api/users/@me', `Bearer ${token}`).catch((error) => {
        console.log(error)
        return undefined

    })

    if (response && !isResponseAnError(response)) return response
    return null

}

const isResponseAnError = (response: JsonObject | ResponseError): response is ResponseError => (response as ResponseError).error !== undefined