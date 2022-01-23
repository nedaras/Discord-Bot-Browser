import { FC } from 'react'
import styles from '../styles/Header.module.scss'

const Header:FC = ({ children }) => {

    return <div className={styles.header} >
        { children }
    </div>

}

export default Header