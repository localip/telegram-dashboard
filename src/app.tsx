import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { DataProvider, ThemeProvider } from '~/components/providers';
import { TooltipProvider } from '~/components/tooltip';
import { Toaster } from '~/components/toaster';
import * as Pages from '~/pages';
import './global.css';

const routes = Object.values(Pages).map(({ path, element: Component }: Pages.Page) => ({ path, element: <Component /> }));
const router = createBrowserRouter(routes);

function App() {
	return (
		<TooltipProvider>
			<DataProvider>
				<ThemeProvider defaultTheme='system'>
					<RouterProvider router={router} />
					<Toaster />
				</ThemeProvider>
			</DataProvider>
		</TooltipProvider>
	);
}

export default App;
