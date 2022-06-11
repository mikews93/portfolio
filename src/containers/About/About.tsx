import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

// @client
import { client, urlFor } from 'shared/sanity/client';

// @components
import AppWrapper from 'components/Wrapper/AppWrapper';
import MotionWrap from 'components/Wrapper/MotionWrapper';

// @styles
import styles from './styles.module.scss';

type AboutType = {
	title: string;
	description: string;
	imgUrl: string;
};

const About = () => {
	/**
	 * State
	 */
	const [abouts, setAbouts] = useState<AboutType[]>([]);

	/**
	 * Effects
	 */
	useEffect(() => {
		const query = '*[_type == "abouts"]';

		client.fetch(query).then((data) => {
			setAbouts(data);
		});
	}, []);

	return (
		<AppWrapper idName='about' classNames={`${styles.about} whitebg`}>
			<MotionWrap classNames={`${styles.about} whitebg`}>
				<div id='about' className={styles.about}>
					<h2 className='head-text'>
						I know that <span>Good Design</span> <br /> means <span>Good Business</span>
					</h2>
					<div className={styles.profiles}>
						{abouts.map((about, index) => (
							<motion.div
								key={about.title + index}
								whileInView={{ opacity: 1 }}
								whileHover={{ scale: 1.1 }}
								transition={{ duration: 0.5, type: 'tween' }}
								className={styles.profile}
							>
								<img src={urlFor(about.imgUrl)} alt={about.title} />
								<h2 className='bold-text mt-5'>{about.title}</h2>
								<p className='p-text mt-5'>{about.description}</p>
							</motion.div>
						))}
					</div>
				</div>
			</MotionWrap>
		</AppWrapper>
	);
};

export default About;
