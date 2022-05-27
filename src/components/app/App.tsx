import { Home } from 'containers/Home/Home'

// @styles 
import styles from './styles.module.scss'

export const App = () => {
  return (
    <div className={styles.app}>
      <Home />
    </div>
  )
}

