import { ChangeEvent, useState } from 'react';

// @components
import AppWrapper from 'components/Wrapper/AppWrapper';
import MotionWrap from 'components/Wrapper/MotionWrapper';

// @styles
import styles from './styles.module.scss';

// @utils
import { client } from 'shared/sanity/client';

type FormData = {
	name: string;
	email: string;
	message: string;
};

const Contact = () => {
	/**
	 * State
	 */
	const [formData, setFormData] = useState<FormData>({ name: '', email: '', message: '' });
	const [isFormSubmitted, setIsFormSubmitted] = useState(false);
	const [loading, setLoading] = useState(false);

	const { name, email, message } = formData;

	/**
	 * Handlers
	 */
	const handleChangeInput = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
		const { name, value } = e.target;
		setFormData({ ...formData, [name]: value });
	};

	const handleSubmit = () => {
		setLoading(true);

		const contact = {
			_type: 'contact',
			name: formData.name,
			email: formData.email,
			message: formData.message,
		};

		client
			.create(contact)
			.then(() => {
				setLoading(false);
				setIsFormSubmitted(true);
			})
			.catch((err) => console.log(err));
	};

	return (
		<AppWrapper idName='contact' classNames='whitebg'>
			<MotionWrap classNames={styles.contact}>
				<>
					<h2 className='head-text'>Take a coffee & chat with me</h2>

					<div className={styles.cards}>
						<div className={styles.card}>
							<img src='/assets/email.png' alt='email' />
							<a href='mailto:mbtechorg@gmail.com' className='p-text'>
								mbtechorg@gmail.com
							</a>
						</div>
						<div className={styles.card}>
							<img src='/assets/mobile.png' alt='phone' />
							<a href='tel:+57 (300) 732-3102' className='p-text'>
								+57 (300) 732-3102
							</a>
						</div>
					</div>
					{!isFormSubmitted ? (
						<div className={styles.form}>
							<div className='flex'>
								<input
									className='p-text'
									type='text'
									placeholder='Your Name'
									name='name'
									value={name}
									onChange={handleChangeInput}
								/>
							</div>
							<div className='flex'>
								<input
									className='p-text'
									type='email'
									placeholder='Your Email'
									name='email'
									value={email}
									onChange={handleChangeInput}
								/>
							</div>
							<div>
								<textarea
									className='p-text'
									placeholder='Your Message'
									value={message}
									name='message'
									onChange={handleChangeInput}
								/>
							</div>
							<button type='button' className='p-text' onClick={handleSubmit}>
								{!loading ? 'Send Message' : 'Sending...'}
							</button>
						</div>
					) : (
						<div>
							<h3 className='head-text'>Thank you for getting in touch!</h3>
						</div>
					)}

					<div className='copyright'>
						<p className='p-text'>@{new Date().getFullYear()} Miguel Blanco</p>
						<p className='p-text'>All rights reserved</p>
					</div>
				</>
			</MotionWrap>
		</AppWrapper>
	);
};

export default Contact;
