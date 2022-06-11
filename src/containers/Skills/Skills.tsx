import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import orderBy from 'lodash/orderBy';

// @components
import AppWrapper from 'components/Wrapper/AppWrapper';
import MotionWrap from 'components/Wrapper/MotionWrapper';

// @styles
import styles from './styles.module.scss';

// @utils
import { client, urlFor } from 'shared/sanity/client';

type SkillsType = {
	name: string;
	bgColor: string;
	icon: string;
};

type ExperienceType = {
	year: string;
	works: {
		name: string;
		company: string;
		desc: string;
	}[];
};

const Skills = () => {
	const [experiences, setExperiences] = useState<ExperienceType[]>([]);
	const [skills, setSkills] = useState<SkillsType[]>([]);

	useEffect(() => {
		const query = '*[_type == "experiences"]';
		const skillsQuery = '*[_type == "skills"]';

		client.fetch(query).then((data) => {
			setExperiences(data);
		});

		client.fetch(skillsQuery).then((data) => {
			setSkills(data);
		});
	}, []);

	return (
		<AppWrapper idName='skills' classNames={`${styles.skills} whitebg`}>
			<MotionWrap classNames={styles.skills}>
				<>
					<h2 className='head-text'>Skills & Experiences</h2>

					<div className={styles.container}>
						<motion.div className={styles.list}>
							{skills.map((skill, index) => (
								<motion.div
									whileInView={{ opacity: [0, 1] }}
									transition={{ duration: 0.5 }}
									className={styles.item}
									key={skill.name + index}
								>
									<div className='flex' style={{ backgroundColor: skill.bgColor }}>
										<img src={urlFor(skill.icon)} alt={skill.name} />
									</div>
									<p className='p-text'>{skill.name}</p>
								</motion.div>
							))}
						</motion.div>
						<div className={styles.exp}>
							{orderBy(experiences, 'year', 'desc').map((experience, index) => (
								<motion.div className={styles.item} key={experience.year + index}>
									<div className={styles.expYear}>
										<p className='bold-text'>{experience.year}</p>
									</div>
									<motion.div className={styles.expWorks}>
										{experience.works.map((work, index) => (
											<>
												<motion.div
													whileInView={{ opacity: [0, 1] }}
													transition={{ duration: 0.5, delay: index * 0.1 }}
													className={styles.expWork}
													data-tip
													data-for={work.name}
													key={work.name + index}
												>
													<h4 className='bold-text'>{work.name}</h4>
													<p className='p-text'>{work.company}</p>
													<p id={work.name} className={styles.description}>
														{work.desc}
													</p>
												</motion.div>
											</>
										))}
									</motion.div>
								</motion.div>
							))}
						</div>
					</div>
				</>
			</MotionWrap>
		</AppWrapper>
	);
};

export default Skills;
