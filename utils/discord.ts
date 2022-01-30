import type { JsonObject } from '../@types'
import type { Guild, DiscordProfile } from '../@types/discord'

import { fetchData, postData } from './fetch-data'

interface DisocrdOAuth2Response {
	access_token: string
	expires_in: number
	refresh_token: string
	scope: string
	token_type: string
}

interface ResponseError {
	global?: boolean
	message?: string
	retry_after?: number

	error?: string
	error_description?: string
}

export async function getToken(code: string) {
	const data = {
		client_id: process.env.NEXT_PUBLIC_DISCORD_CLIENT_ID,
		client_secret: process.env.DISCORD_CLIENT_SECRET,
		grant_type: 'authorization_code',
		code,
		redirect_uri: process.env.NEXT_PUBLIC_DISCORD_OAUTH2_ENCODED_REDIRECT_URI,
		scope: process.env.NEXT_PUBLIC_DISCORD_OAUTH2_ENCODED_SCOPES,
	}

	const response = await postData<DisocrdOAuth2Response | ResponseError>('https://discordapp.com/api/oauth2/token', data, 'x-www-form-urlencoded').catch(() => null)
	return response && !isResponseAnError(response) ? response.access_token : null
}

export async function getProfile(token: string) {
	const response = await fetchData<DiscordProfile | ResponseError>('https://discordapp.com/api/users/@me', `Bearer ${token}`).catch(() => null)
	return response && !isResponseAnError(response) ? response : null
}

export async function isGuildValid(token: string, guild: string) {
	const response = await fetchData<Guild[] | ResponseError>(`https://discordapp.com/api/users/@me/guilds/${guild}/member`, `Bearer ${token}`).catch(() => null)
	return response && !isResponseAnError(response) ? true : false
}

const isResponseAnError = (response: JsonObject | ResponseError): response is ResponseError =>
	(response as ResponseError).error !== undefined || (response as ResponseError).message !== undefined
