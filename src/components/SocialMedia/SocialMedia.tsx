import { Tooltip } from 'antd';
import { useEffect, useState } from 'react';

// @client
import { client, urlFor } from 'shared/sanity/client';

// @styles
import styles from './styles.module.scss';

type SocialMediaType = {
	name: string;
	link: string;
	icon: string;
	tooltip: string;
};

const SocialMedia = () => {
	/**
	 * State
	 */
	const [socialMedia, setSocialMedia] = useState<SocialMediaType[]>([]);

	/**
	 * Effects
	 */
	useEffect(() => {
		const query = '*[_type == "socialMedia"]';

		client.fetch(query).then((data) => {
			setSocialMedia(data);
		});
	}, []);

	/**
	 * handlers
	 */
	const handleClick = (url: string) => {
		window.open(url, '_blank');
	};

	return (
		<div className={styles.social}>
			{socialMedia.map((media, index) => (
				<div key={index} onClick={() => handleClick(media.link)}>
					<Tooltip title={media.tooltip} placement='right'>
						<img src={urlFor(media.icon)} alt={media.tooltip} />
					</Tooltip>
				</div>
			))}
		</div>
	);
};

export default SocialMedia;
