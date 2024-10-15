import { SearchAutocomplete } from "./form/Form";
import { useSearchAutocomplete } from "./form/hooks";

export const UpdateProduct = () => {
	const {
		control,
		categoryOptions,
		isCategoryLoading,
		subCategoryOptions,
		isSubCategoryLoading,
		setValue,
	} = useSearchAutocomplete();

	return (
		<div>
			UpdateProduct
			<SearchAutocomplete
				control={control}
				categoryOptions={categoryOptions}
				isCategoryLoading={isCategoryLoading}
				subCategoryOptions={subCategoryOptions}
				isSubCategoryLoading={isSubCategoryLoading}
				setValue={setValue}
			/>
		</div>
	);
};
