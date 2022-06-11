// @components
import Contact from 'containers/Contact/Contact';
import Profile from 'containers/Profile/Profile';
import Navbar from 'components/Navbar/Navbar';
import About from 'containers/About/About';
import Skills from 'containers/Skills/Skills';
import Testimonials from 'containers/Testimonials/Testotimonial';
import Work from 'containers/Work/Work';
import SocialMedia from 'components/SocialMedia/SocialMedia';

// @styles
import styles from './styles.module.scss';

const Portfolio = () => {
	return (
		<div className={styles.portfolio}>
			<Navbar />
			<Profile />
			<About />
			<Work />
			<Skills />
			<Testimonials />
			<Contact />
			<SocialMedia />
		</div>
	);
};

export default Portfolio;
