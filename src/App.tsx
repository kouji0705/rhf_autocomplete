import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { UpdateProduct } from "./UpdateProduct";

function App() {
	const queryClient = new QueryClient();
	return (
		<QueryClientProvider client={queryClient}>
			<UpdateProduct />
		</QueryClientProvider>
	);
}

export default App;
