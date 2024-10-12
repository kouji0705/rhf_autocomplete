import axios from "axios";
import { useEffect, useState, useCallback } from "react";
import { useForm } from "react-hook-form";

// カテゴリの型定義
export interface Category {
	id: number;
	key: string;
	name: string;
}

export interface SubCategory {
	id: number;
	key: string;
	name: string;
}

export const useCategoryForm = () => {
	const { control, watch, setValue } = useForm({
		defaultValues: {
			category: "",
			subCategory: "",
		},
	});

	const [categories, setCategories] = useState<Category[]>([]);
	const [subCategoryOptions, setSubCategoryOptions] = useState<SubCategory[]>(
		[],
	);
	const selectedCategory = watch("category");

	// 大分類データの取得
	const fetchCategories = useCallback(async () => {
		const response = await axios.get<Category[]>(
			"http://localhost:3000/api/category",
		);
		setCategories(response.data);
	}, []); // useCallbackでメモ化

	// 小分類データの取得
	const fetchSubCategories = useCallback(async (categoryId: number) => {
		const response = await axios.get<SubCategory[]>(
			`http://localhost:3000/api/category/${categoryId}`,
		);
		setSubCategoryOptions(response.data);
	}, []);

	// 初回レンダリング時に大分類を取得
	useEffect(() => {
		fetchCategories();
	}, [fetchCategories]); // 依存配列にfetchCategoriesを追加

	// 大分類が変更されたときに小分類を取得
	useEffect(() => {
		if (selectedCategory) {
			fetchSubCategories(Number(selectedCategory));
			setValue("subCategory", ""); // 小分類をリセット
		}
	}, [selectedCategory, fetchSubCategories, setValue]); // fetchSubCategoriesを依存配列に追加

	return {
		control,
		categories,
		subCategoryOptions,
		selectedCategory,
	};
};
