import { useForm, Controller } from "react-hook-form";
import { TextField, Autocomplete } from "@mui/material";
import { useCategoryOptions, useSubCategoryOptions } from "./hooks";
import type { FormValues, Category } from "./type";

// ユーザー検索のためのAutocompleteコンポーネント
export const SearchAutocomplete = () => {
	const { control, handleSubmit, watch, setValue } = useForm<FormValues>({
		defaultValues: {
			category: null,
			subCategory: null,
		},
	});

	// 親カテゴリーの監視
	const selectedCategory = watch("category");
	const categoryId = selectedCategory?.id || null;

	// 親カテゴリーの検索に基づくオプションを取得
	const { data: categoryOptions = [], isLoading: isCategoryLoading } =
		useCategoryOptions(watch("category")?.name || "");

	// サブカテゴリー検索のための監視
	const subCategorySearchName = watch("subCategory")?.name || "";

	// サブカテゴリーのオプションを取得
	const { data: subCategoryOptions = [], isLoading: isSubCategoryLoading } =
		useSubCategoryOptions(categoryId, subCategorySearchName);

	// フォームの送信処理
	const onSubmit = (data: FormValues) => {
		console.log("選択されたデータ:", data);
	};

	return (
		<form onSubmit={handleSubmit(onSubmit)}>
			{/* 親カテゴリーのAutocomplete */}
			<Controller
				name="category"
				control={control}
				render={({ field }) => (
					<Autocomplete
						{...field}
						sx={{ width: 300 }}
						options={categoryOptions}
						getOptionLabel={(option: Category) => option.name} // nameフィールドを表示
						loading={isCategoryLoading}
						value={field.value}
						onChange={(event, value) => {
							field.onChange(value); // 親カテゴリー選択時にフィールドを更新
							setValue("subCategory", null); // 親カテゴリー変更時にサブカテゴリーをリセット
						}}
						renderInput={(params) => (
							<TextField
								{...params}
								label="親カテゴリー検索"
								variant="outlined"
								InputProps={{
									...params.InputProps,
								}}
							/>
						)}
					/>
				)}
			/>

			{/* サブカテゴリーのAutocomplete */}
			<Controller
				name="subCategory"
				control={control}
				render={({ field }) => (
					<Autocomplete
						{...field}
						sx={{ width: 300, marginTop: "16px" }}
						options={subCategoryOptions}
						getOptionLabel={(option: Category) => option.name} // nameフィールドを表示
						loading={isSubCategoryLoading}
						value={field.value}
						onInputChange={(event, value) => {
							if (field.value) {
								setValue("subCategory", {
									...field.value,
									name: value,
									id: field.value.id ?? 0,
								});
							}
						}} // サブカテゴリーの入力変更時にsearchNameを更新
						onChange={(event, value) => field.onChange(value)} // サブカテゴリー選択時にフィールドを更新
						renderInput={(params) => (
							<TextField
								{...params}
								label="サブカテゴリー検索"
								variant="outlined"
								InputProps={{
									...params.InputProps,
								}}
							/>
						)}
					/>
				)}
			/>
		</form>
	);
};
