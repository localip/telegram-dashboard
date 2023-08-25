import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { DataProvider, ThemeProvider } from '~/components/providers';
import * as Pages from '~/pages';

const routes = Object.values(Pages).map(({ path, element: Component }: Pages.Page) => ({ path, element: <Component /> }));
const router = createBrowserRouter(routes);

function App() {
	return (
		<DataProvider>
			<ThemeProvider defaultTheme='system'>
				<RouterProvider router={router} />
			</ThemeProvider>
		</DataProvider>
	);
}

export default App;
