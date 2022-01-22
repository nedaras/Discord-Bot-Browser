import type { NextApiRequest, NextApiResponse } from 'next'
import { JsonObject } from '../../../@types'
import { ResponseError } from '../../../@types/apiResponse'
import { fetchData } from '../../../utils/fetch-data'

interface  DiscordResponseError {
    message: string
    code: number
    
}

export default async function handler(request: NextApiRequest, response: NextApiResponse<ResponseError | { guild_id: string }>) {

    const { guild_id } = request.body as JsonObject<string | undefined>

    if (request.method?.toUpperCase() !== 'POST') return response.status(404).json({ status: 400, message: 'only accpets "POST" requests' })
    if (!guild_id) return response.status(404).json({ status: 400, message: 'missing some fields' })
    
    try {

        const guild = await fetchData<DiscordResponseError | { id: string }>(`https://discordapp.com/api/guilds/${guild_id}`, `Bot ${process.env.DISCORD_CLIENT_TOKEN}`)
        if (!isResponseAnError(guild)) return response.json({ guild_id: guild.id })
        
    } catch(error) { console.log(error) }

    response.status(404).json({
        status: 404,
        message: 'guild not found'

    })

}

const isResponseAnError = (response: JsonObject | DiscordResponseError): response is DiscordResponseError => (response as DiscordResponseError).code !== undefined