import { Button } from 'antd';
import { motion } from 'framer-motion';

// @components
import AppWrapper from 'components/Wrapper/AppWrapper';

// @styles
import styles from './styles.module.scss';

const scaleVariants = {
	whileInView: {
		scale: [0, 1],
		opacity: [0, 1],
		transition: {
			duration: 1,
			ease: 'easeInOut',
		},
	},
};

const Profile = () => {
	const handleClickContact = () => {
		window.location.href = '#contact';
	};

	return (
		<AppWrapper idName='me'>
			<div className={styles.profile}>
				<motion.div
					whileInView={{ x: [-100, 0], opacity: [0, 1] }}
					transition={{ duration: 0.5 }}
					className={styles.info}
				>
					<div className={styles.badge}>
						<div className={styles.cmp}>
							<span>👋</span>
							<div style={{ marginLeft: 20 }}>
								<p className='p-text'>Hi, I am</p>
								<h1 className='head-text'>Miguel</h1>
							</div>
						</div>
						<div className={styles.tagCmp}>
							<p className='p-text'>External consultant</p>
							<p className='p-text'>Web developer</p>
							<p className='p-text'>Programer</p>
						</div>
						<div className={styles.contact}>
							<p className='p-text'>Like what you see?</p>
							<Button type='primary' shape='round' onClick={handleClickContact}>
								Get in touch
							</Button>
						</div>
					</div>
				</motion.div>
				<motion.div
					whileInView={{ opacity: [0, 1] }}
					transition={{ duration: 0.5, delayChildren: 0.5 }}
					className={styles.img}
				>
					<img src='/assets/profile.png' alt='profile' />
					<motion.img
						whileInView={{ scale: [0, 1] }}
						transition={{ duration: 1, ease: 'easeInOut' }}
						className={styles.overlayCircle}
						src='/assets/circle.svg'
						alt='profile_circle'
					/>
				</motion.div>
				<motion.div
					variants={scaleVariants}
					whileInView={scaleVariants.whileInView}
					className={styles.circles}
				>
					{['/assets/flutter.png', '/assets/sass.png', '/assets/redux.png'].map((circle, index) => (
						<div className={`flex ${styles.circleCmp}`} key={`circle-${index}`}>
							<img src={circle} alt='circle' />
						</div>
					))}
				</motion.div>
			</div>
		</AppWrapper>
	);
};

export default Profile;
