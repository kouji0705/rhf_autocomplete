import type React from "react";
import { Controller } from "react-hook-form";
import { Select, MenuItem, FormControl, InputLabel } from "@mui/material";
import { useCategoryForm } from "./hooks";

export const FormWithDependentSelects: React.FC = () => {
	const { control, subCategoryOptions, selectedCategory } = useCategoryForm();

	return (
		<form>
			{/* 大分類のプルダウン */}
			<FormControl fullWidth>
				<InputLabel id="category-label">大分類</InputLabel>
				<Controller
					name="category"
					control={control}
					render={({ field }) => (
						<Select {...field} labelId="category-label" label="大分類">
							<MenuItem value="">
								<em>選択してください</em>
							</MenuItem>
							<MenuItem value="food">食べ物</MenuItem>
							<MenuItem value="animal">動物</MenuItem>
							<MenuItem value="vehicle">乗り物</MenuItem>
						</Select>
					)}
				/>
			</FormControl>

			{/* 小分類のプルダウン */}
			<FormControl fullWidth style={{ marginTop: "16px" }}>
				<InputLabel id="subCategory-label">小分類</InputLabel>
				<Controller
					name="subCategory"
					control={control}
					render={({ field }) => (
						<Select
							{...field}
							labelId="subCategory-label"
							label="小分類"
							disabled={!selectedCategory} // 大分類が選ばれていないときは無効化
						>
							<MenuItem value="">
								<em>選択してください</em>
							</MenuItem>
							{subCategoryOptions.map((subCategory) => (
								<MenuItem key={subCategory} value={subCategory}>
									{subCategory}
								</MenuItem>
							))}
						</Select>
					)}
				/>
			</FormControl>
		</form>
	);
};
