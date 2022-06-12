import { lazy, Suspense } from 'react';

// @components
import GeneralLoading from 'components/GeneralLoading/GeneralLoading';
import Navbar from 'components/Navbar/Navbar';
import SocialMedia from 'components/SocialMedia/SocialMedia';

// @styles
import styles from './styles.module.scss';

const Contact = lazy(() => import('containers/Contact/Contact'));
const Profile = lazy(() => import('containers/Profile/Profile'));
const About = lazy(() => import('containers/About/About'));
const Skills = lazy(() => import('containers/Skills/Skills'));
const Testimonials = lazy(() => import('containers/Testimonials/Testimonials'));
const Work = lazy(() => import('containers/Work/Work'));

const Portfolio = () => {
	return (
		<div className={styles.portfolio}>
			<Suspense fallback={<GeneralLoading />}>
				<Navbar />
				<Profile />
				<About />
				<Work />
				<Skills />
				<Testimonials />
				<Contact />
				<SocialMedia />
			</Suspense>
		</div>
	);
};

export default Portfolio;
