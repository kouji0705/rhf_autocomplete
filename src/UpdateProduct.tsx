import { Button } from "@mui/material";
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
		dirtyFields,
		onSubmit,
		onCancel,
	} = useSearchAutocomplete();

	return (
		<div>
			<h1>UpdateProduct</h1>
			<SearchAutocomplete
				control={control}
				categoryOptions={categoryOptions}
				isCategoryLoading={isCategoryLoading}
				subCategoryOptions={subCategoryOptions}
				isSubCategoryLoading={isSubCategoryLoading}
				setValue={setValue}
			/>
			{dirtyFields && (
				<div>
					{Object.keys(dirtyFields).length > 0
						? "以下のフィールドが変更されました:"
						: "変更はありません"}
					<ul>
						{Object.keys(dirtyFields).map((field) => (
							<li key={field}>{field}</li>
						))}
					</ul>
					<Button
						onClick={onSubmit}
						sx={{ width: 300, backgroundColor: "blue", color: "white" }}
					>
						保存
					</Button>
					<Button onClick={onCancel}>キャンセル</Button>
				</div>
			)}
		</div>
	);
};
