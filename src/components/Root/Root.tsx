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

// @api
import { SWR_CONFIG } from 'shared/api/api';

// @routes
import { ROUTES } from 'shared/routes';
import Portfolio from 'containers/Portfolio/Portfolio';

export const Root = () => {
	return (
		<ErrorBoundary>
			<SharedDataProvider>
				<SWRConfig value={SWR_CONFIG}>
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
							<Route path={ROUTES.PORTFOLIO} element={<Portfolio />} />
							<Route path={ROUTES.NOT_FOUND} element={<NotFound />} />
						</Routes>
					</BrowserRouter>
				</SWRConfig>
			</SharedDataProvider>
		</ErrorBoundary>
	);
};
