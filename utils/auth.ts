import type { DiscordProfile } from '../@types/discord'

import { initializeApp, cert, getApps } from 'firebase-admin/app'
import { getAuth } from 'firebase-admin/auth'
import { getFirestore } from 'firebase-admin/firestore'

import service from '../firebase-service.json'

const app = getApps()[0] || initializeApp({ credential: cert(service as any) })
const auth = getAuth(app)
const firestore = getFirestore(app)

export async function login(profile: DiscordProfile, access_token: string, refresh_token: string) {
    
    const user = await auth.getUser(profile.id).catch(() => undefined)

    if (user) auth.updateUser(profile.id, {
        email: profile.email,
        emailVerified: profile.verified,
        displayName: profile.username
    
    }); else auth.createUser({
        uid: profile.id,
        email: profile.email,
        emailVerified: profile.verified,
        displayName: profile.username
    
    })

    firestore.doc(`/users/${profile.id}`).set({ access_token, refresh_token })

    return auth.createCustomToken(profile.id, { access_token, refresh_token })
    
}