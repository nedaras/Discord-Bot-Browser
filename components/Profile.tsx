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
			{isProfileSettingsShowing && (
				<Backdrop onClick={() => showProfileSettings(false)}>
					<button onClick={() => auth.signOut()}>Sign out</button>
				</Backdrop>
			)}
			{profile && (
				<img
					onClick={() => showProfileSettings(true)}
					className={styles.profile}
					src={`https://cdn.discordapp.com/avatars/${profile.id}/${profile.avatar}.webp?size=64`}
				/>
			)}
		</>
	)
}

export default Header
