import React from "react";
import { Controller } from "react-hook-form";
import { Autocomplete, TextField, FormControl } from "@mui/material";
import { useCategoryForm } from "./hooks";

export const FormWithDependentAutoComplete: React.FC = () => {
	const { control, categories, subCategoryOptions, selectedCategory } =
		useCategoryForm();

	return (
		<form>
			{/* 大分類のAutoComplete */}
			<FormControl fullWidth>
				<Controller
					name="category"
					control={control}
					render={({ field }) => {
						const selectedCategory =
							categories.find((category) => category.id === field.value) ||
							null; // idに基づいてオブジェクトを取得
						return (
							<Autocomplete
								{...field}
								options={categories}
								getOptionLabel={(option) => option.name} // カテゴリ名を表示
								isOptionEqualToValue={(option, value) =>
									option.id === value?.id
								} // 値の比較
								value={selectedCategory} // Category型のオブジェクトをvalueにセット
								onChange={(_, newValue) => field.onChange(newValue?.id || "")} // 選択されたCategoryのidをvalueに設定
								renderInput={(params) => (
									<TextField {...params} label="大分類" />
								)}
							/>
						);
					}}
				/>
			</FormControl>

			{/* 小分類のAutoComplete */}
			{selectedCategory && (
				<FormControl fullWidth style={{ marginTop: "16px" }}>
					<Controller
						name="subCategory"
						control={control}
						render={({ field }) => {
							return (
								<Autocomplete
									{...field}
									options={subCategoryOptions}
									getOptionLabel={(option) => option.name} // 小分類名を表示
									isOptionEqualToValue={(option, value) =>
										option.id === value?.id
									} // 値の比較
									value={selectedSubCategory} // SubCategory型のオブジェクトをvalueにセット
									onChange={(_, newValue) => field.onChange(newValue?.id || "")} // 選択されたSubCategoryのidをvalueに設定
									renderInput={(params) => (
										<TextField {...params} label="小分類" />
									)}
									disabled={!subCategoryOptions.length} // 小分類がない場合は無効化
								/>
							);
						}}
					/>
				</FormControl>
			)}
		</form>
	);
};
