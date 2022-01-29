import { initializeApp, cert, getApps } from 'firebase-admin/app'
import { getAuth } from 'firebase-admin/auth'
import { getFirestore } from 'firebase-admin/firestore'

const config = {
	type: process.env.FIREBASE_ADMIN_TYPE,
	project_id: process.env.FIREBASE_ADMIN_PROJECT_ID,
	private_key_id: process.env.FIREBASE_ADMIN_PRIVATE_KEY_ID,
	private_key: process.env.FIREBASE_ADMIN_PRIVATE_KEY!.replace(/\\n/g, '\n'),
	client_email: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
	client_id: process.env.FIREBASE_ADMIN_CLIENT_ID,
	auth_uri: process.env.FIREBASE_ADMIN_AUTH_URI,
	token_uri: process.env.FIREBASE_ADMIN_TOKEN_URI,
	auth_provider_x509_cert_url:
		process.env.FIREBASE_ADMIN_AUTH_PROVIDER_CERT_URL,
	client_x509_cert_url: process.env.FIREBASE_ADMIN_CLIENT_CERT_URL,
}

const app = getApps()[0] || initializeApp({ credential: cert(config as any) })

export const auth = getAuth(app)
export const firestore = getFirestore(app)
