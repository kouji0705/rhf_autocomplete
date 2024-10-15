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
	const selectedCategory = watch("category"); // カテゴリーの選択を監視
	const categoryId = selectedCategory?.id || null;

	// 親カテゴリーの検索に基づくオプションを取得
	const { data: categoryOptions = [], isLoading: isCategoryLoading } =
		useCategoryOptions(watch("category")?.name || "");

	// サブカテゴリーのオプションを取得
	const { data: subCategoryOptions = [], isLoading: isSubCategoryLoading } =
		useSubCategoryOptions(categoryId);

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
							field.onChange(value);
							setValue("subCategory", null);
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
