import useSwr from 'swr';

// @api
import { getFetcher } from 'shared/api/api';

type UseRequestReturn<T> = [
	T,
	{
		isLoading: boolean;
		error: any;
	}
];

type UseRequestOptions = {
	path: string;
	name?: string;
	options?: any;
};

export const useRequest = <T,>({ path, name, options }: UseRequestOptions): UseRequestReturn<T> => {
	if (!path) {
		throw new Error('Path is required');
	}

	const url = name ? `${path}/${name}` : path;
	const { data, error, isValidating } = useSwr(url, getFetcher(options));

	return [data, { error, isLoading: (!data && !error) || isValidating }];
};
