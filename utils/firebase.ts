import { initializeApp, getApps } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

import config from '../firebase-config.json'

const app = getApps()[0] || initializeApp(config)

export const auth = getAuth(app) 
export const firestore = getFirestore(app)