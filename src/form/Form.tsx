import {
	type Control,
	Controller,
	type UseFormSetValue,
} from "react-hook-form";
import { TextField, Autocomplete } from "@mui/material";
import type { Category, FormValues } from "./type";

type Props = {
	control: Control<FormValues, unknown>;
	categoryOptions: Category[];
	isCategoryLoading: boolean;
	subCategoryOptions: Category[];
	isSubCategoryLoading: boolean;
	setValue: UseFormSetValue<FormValues>;
};

// ユーザー検索のためのAutocompleteコンポーネント
export const SearchAutocomplete = ({
	control,
	categoryOptions,
	isCategoryLoading,
	subCategoryOptions,
	isSubCategoryLoading,
	setValue,
}: Props) => {
	return (
		<form>
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
