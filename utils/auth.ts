import type { DiscordProfile } from '../@types/discord'

import { initializeApp, cert, getApps } from 'firebase-admin/app'
import { getAuth } from 'firebase-admin/auth'
import { getFirestore } from 'firebase-admin/firestore'

import service from '../firebase-service.json'

const app = getApps()[0] || initializeApp({ credential: cert(service as any) })

const auth = getAuth(app)

export async function login(profile: DiscordProfile) {
    
    try {

        const user = await auth.getUser(profile.id).catch(() => undefined)

        if (user) {
    
            auth.updateUser(profile.id, {
                email: profile.email,
                emailVerified: profile.verified,
                displayName: profile.username
        
            })
    
        } else {
    
            auth.createUser({
                uid: profile.id,
                email: profile.email,
                emailVerified: profile.verified,
                displayName: profile.username
        
            })
    
        }
    
        return auth.createCustomToken(profile.id)

    } catch(error) { console.log(error) }
    
}