// @vendors
import { createContext } from 'react';

const initialState = null;

// @types
export interface SharedDataType {
	user: {
		info?: {
			name: string;
		};
		isFetching: boolean;
		isAuthenticated: boolean;
	};
}

interface SharedDataContextType extends SharedDataType {
	setSharedData: (data: SharedDataType) => void;
}

// @context
export const SharedDataContext = createContext<SharedDataContextType | null>(initialState);
