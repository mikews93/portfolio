import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { SWRConfig } from 'swr';

// @components
import ErrorBoundary from 'components/ErrorBoundary/ErrorBoundary';
import { Home } from 'containers/Home/Home';
import { RestrictedRoutes } from 'components/RestrictedRoute/RestrictedRoute';
import { Login } from 'containers/Login/Login';
import { NotFound } from 'components/NotFound/NotFound';

// @providers
import { SharedDataProvider } from 'shared/context/sharedDataProvider';

// @routes
import { ROUTES } from 'shared/routes';
// import axios from 'axios'

// const fetcher = url => axios.get(url).then(res => res.data)

export const App = () => {
	return (
		<ErrorBoundary>
			<SharedDataProvider>
				<SWRConfig
					value={{
						fetcher: (resource, init) => fetch(resource, init).then((res) => res.json()),
						refreshInterval: 3000,
					}}
				>
					<BrowserRouter>
						<Routes>
							<Route path={ROUTES.LOGIN} element={<Login />} />
							<Route
								path={ROUTES.HOME}
								element={
									<RestrictedRoutes>
										<Home />
									</RestrictedRoutes>
								}
							/>
							<Route path={ROUTES.NOT_FOUND} element={<NotFound />} />
						</Routes>
					</BrowserRouter>
				</SWRConfig>
			</SharedDataProvider>
		</ErrorBoundary>
	);
};
