import { AnimatePresence } from 'framer-motion'
import { FC, useState } from 'react'
import { DiscordProfile } from '../@types/discord'
import styles from '../styles/Profile.module.scss'
import { auth } from '../utils/firebase'
import Backdrop from './Backdrop'

interface Props {
	profile: DiscordProfile | null
}

const Header: FC<Props> = ({ profile }) => {
	const [isProfileSettingsShowing, showProfileSettings] = useState(false)

	return (
		<>
			<AnimatePresence initial={false} exitBeforeEnter={true}>
				{isProfileSettingsShowing && (
					<Backdrop onClick={() => showProfileSettings(false)}>
						<button onClick={() => auth.signOut()}>Sign out</button>
					</Backdrop>
				)}
			</AnimatePresence>
			{profile && (
				<img
					onClick={() => showProfileSettings(true)}
					className={styles.profile}
					width="40"
					height="40"
					src={`https://cdn.discordapp.com/avatars/${profile.id}/${profile.avatar}.webp?size=32`}
				/>
			)}
		</>
	)
}

export default Header
