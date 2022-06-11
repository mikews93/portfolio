// @component
import NavigationDots from 'components/NavigationDots/NavigationDots';

// @styles
import styles from './styles.module.scss';

interface AppWrapperProps {
	children: JSX.Element;
	idName: string;
	classNames?: string;
}

const AppWrapper = ({ children, idName, classNames = '' }: AppWrapperProps) => (
	<div id={idName} className={`container ${classNames}`}>
		<div className={`${styles.wrapper} flex`}>{children}</div>
		<NavigationDots active={idName} />
	</div>
);
export default AppWrapper;
