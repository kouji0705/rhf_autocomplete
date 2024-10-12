import { useEffect, useState, useCallback } from "react";
import { useForm } from "react-hook-form";

export const useCategoryForm = () => {
	const { control, watch, setValue } = useForm({
		defaultValues: {
			category: "",
			subCategory: "",
		},
	});

	const [categories, setCategories] = useState([]);
	const [subCategoryOptions, setSubCategoryOptions] = useState([]);
	const selectedCategory = watch("category");

	// 大分類データの取得
	const fetchCategories = useCallback(async () => {
		const response = await fetch("http://localhost:3000/api/category");
		const data = await response.json();
		setCategories(data);
	}, []); // useCallbackでメモ化

	// 小分類データの取得
	const fetchSubCategories = useCallback(async (categoryId: number) => {
		const response = await fetch(
			`http://localhost:3000/api/category/${categoryId}`,
		);
		const data = await response.json();
		setSubCategoryOptions(data);
	}, []); // useCallbackでメモ化

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
