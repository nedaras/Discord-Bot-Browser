import { FC } from 'react'
import { motion } from 'framer-motion'
import styles from '../styles/Notification.module.scss'
import useTimeout from '../hooks/use-timeout'

interface Props {
	delay: number
	onTimeout: () => void
}

const Norification: FC<Props> = ({ children, delay, onTimeout }) => {
	useTimeout(() => onTimeout(), delay)

	return (
		<motion.div
			className={styles.notification}
			initial={{ y: '100%' }}
			animate={{ y: 0 }}
			exit={{ y: '100%' }}
		>
			{children}
		</motion.div>
	)
}

export default Norification
