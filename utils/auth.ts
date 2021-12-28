import type { DiscordProfile } from '../@types/discord'

import { auth, firestore } from './firebase-admin'

export async function login(profile: DiscordProfile, access_token: string) {

    firestore.doc(`/users/${profile.id}`).set({ access_token })

    return auth.createCustomToken(profile.id, { access_token })
    
}