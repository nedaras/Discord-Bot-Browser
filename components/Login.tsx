import { FC } from 'react'
import Backdrop from './Backdrop'
import styles from '../styles/Login.module.scss'
import Link from 'next/link'
import cookie from 'js-cookie'
import { useRouter } from 'next/router'
import { motion } from 'framer-motion'

interface Props {
	onClose: () => void
}

const loginURI = `https://discordapp.com/api/oauth2/authorize?client_id=${process.env.NEXT_PUBLIC_DISCORD_CLIENT_ID}&redirect_uri=${process.env.NEXT_PUBLIC_DISCORD_OAUTH2_ENCODED_REDIRECT_URI}&response_type=code&scope=${process.env.NEXT_PUBLIC_DISCORD_OAUTH2_ENCODED_SCOPES}`

const Login: FC<Props> = ({ onClose }) => {
	const router = useRouter()

	const createCookie = () =>
		cookie.set('guild', router.query.guild as string, {
			expires: 1 / 24 / 60,
			sameSite: 'strict',
			path: '/',
		})

	return (
		<Backdrop onClick={onClose}>
			<div
				className={styles.login}
				onClick={(event) => event.stopPropagation()}
			>
				<h3>You need to be logged in to edit this queue.</h3>
				<Link href={loginURI}>
					<motion.button
						className={styles.discord}
						onClick={createCookie}
						whileHover={{ y: -5 }}
						whileTap={{ scale: 0.9 }}
					>
						Log In with Discord
					</motion.button>
				</Link>
				<motion.button
					className={styles.cancel}
					onClick={onClose}
					whileHover={{ y: -5 }}
					whileTap={{ scale: 0.9 }}
				>
					Cancel
				</motion.button>
			</div>
		</Backdrop>
	)
}

export default Login
