import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SearchAutocomplete } from "./form/Form";

function App() {
	const queryClient = new QueryClient();
	return (
		<QueryClientProvider client={queryClient}>
			<SearchAutocomplete />
		</QueryClientProvider>
	);
}

export default App;
