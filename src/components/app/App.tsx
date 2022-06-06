// @components
import { Home } from 'containers/Home/Home';

// @styles
import styles from './styles.module.scss';

export const App = () => {
	console.log('App.tsx');
	return (
		<div className={styles.app}>
			<Home />
		</div>
	);
};
