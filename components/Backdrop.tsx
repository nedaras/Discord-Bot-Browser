import { FC, MouseEventHandler } from 'react'
import { motion } from 'framer-motion'
import styles from '../styles/Backdrop.module.scss'

interface Props {
	onClick: MouseEventHandler<HTMLDivElement>
}

const Backdrop: FC<Props> = ({ children, onClick }) => {
	return (
		<motion.div className={styles.backdrop} onClick={onClick} initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>
			{children}
		</motion.div>
	)
}

export default Backdrop
