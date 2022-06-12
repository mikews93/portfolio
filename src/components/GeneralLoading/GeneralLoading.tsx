import SVG from 'react-inlinesvg';

import BrandIcon from './brand-icon.svg';

import './styles.scss';
const GeneralLoading = () => {
	return (
		<div className='absolute-center'>
			<SVG src={BrandIcon} />
		</div>
	);
};

export default GeneralLoading;
