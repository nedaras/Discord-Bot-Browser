import type { User } from 'firebase/auth'

import { initializeApp, getApps } from 'firebase/app'
import { getAuth, onAuthStateChanged } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

import config from '../firebase-config.json'

const app = getApps()[0] || initializeApp(config)

const _auth = getAuth(app) 
const _firestore = getFirestore(app)

export const getCurrentUser = (): Promise<User | null> => new Promise((resolve) => onAuthStateChanged(auth, resolve))

export const auth = _auth
export const firestore = _firestore