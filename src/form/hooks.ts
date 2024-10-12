import { useForm } from "react-hook-form";
import { categories } from "./const";
import { useEffect } from "react";
import type { CategoryKey } from "./type";

export const useCategoryForm = () => {
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

	return {
		control,
		selectedCategory,
		subCategoryOptions,
	};
};
