import { FC, useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import styles from '../styles/Notification.module.scss'
import useTimeout from '../hooks/use-timeout'

interface Props {
	onTimeout: () => void
}

const Norification: FC<Props> = ({ onTimeout, children }) => {
	const [reset] = useTimeout(() => onTimeout(), 5000)

	useEffect(() => reset(), [children])

	return (
		<AnimatePresence initial={false} exitBeforeEnter={true}>
			{children && (
				<motion.div className={styles.notification} initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}>
					{children}
				</motion.div>
			)}
		</AnimatePresence>
	)
}

export default Norification
