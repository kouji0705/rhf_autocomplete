// import { SearchAutocomplete } from "./SearchComplete";

import { CategoryFormWithDebounce } from "./form/FormWithDependentAutoComplete";

function App() {
	return (
		<div>
			{/* <FormWithDependentSelects /> */}
			<CategoryFormWithDebounce />
			{/* <CategoryForm /> */}
		</div>
	);
}

export default App;
