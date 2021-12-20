export interface DiscordProfile {
    id: string
    username: string
    avatar: string
    discriminator: number
    public_flags: number
    flags: number
    banner: string
    banner_color: number
    accent_color: number
    locale: string
    mfa_enabled: boolean
    email: string
    verified: boolean

}

export interface Guild {
    id: string,
    name: string,
    icon: string,
    owner: boolean,
    permissions: number
    features: string[]
    permissions_new: string

}