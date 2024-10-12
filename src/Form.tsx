import type React from "react";
import { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { Select, MenuItem, FormControl, InputLabel } from "@mui/material";

// 大分類と小分類のデータ
const categories = {
	food: ["りんご", "バナナ", "オレンジ"],
	animal: ["犬", "猫", "鳥"],
	vehicle: ["車", "自転車", "飛行機"],
} as const;

type CategoryKey = keyof typeof categories;

export const FormWithDependentSelects: React.FC = () => {
	const { control, watch, setValue } = useForm({
		defaultValues: {
			category: "",
			subCategory: "",
		},
	});

	// 大分類をwatchで監視
	const selectedCategory = watch("category") as CategoryKey | ""; // 型アサーションでCategoryKeyにキャスト

	// 大分類が変更されたときに、小分類をリセット
	useEffect(() => {
		if (selectedCategory) {
			setValue("subCategory", ""); // 小分類をリセット
		}
	}, [selectedCategory, setValue]);

	// 小分類の選択肢を動的に生成
	const subCategoryOptions = selectedCategory
		? categories[selectedCategory]
		: [];

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
