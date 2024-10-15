import { useEffect, useState, useCallback } from "react";
import { useForm } from "react-hook-form";
import type { SubCategory } from "./type";
import { getCategories, getSubCategories } from "./api";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

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
		const response = await getCategories();
		setCategories(response);
	}, []); // useCallbackでメモ化

	// 小分類データの取得
	const fetchSubCategories = useCallback(async (categoryId: number) => {
		const response = await getSubCategories(categoryId);
		setSubCategoryOptions(response);
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

// // カスタムフック: ユーザーのオプションを取得
// export const useUserOptions = (searchQuery: string) => {
// 	return useQuery({
// 		queryKey: ["users", searchQuery], // クエリキーを渡す
// 		queryFn: () => fetchUserOptions(searchQuery), // クエリ関数
// 	});
// };

// const fetchCategories = async (
// 	searchName?: string,
// ): Promise<PullDownOption[]> => {
// 	const response = await axios.get("/api/category", {
// 		params: { searchName }, // searchNameクエリパラメータをAPIに送る
// 	});
// 	return response.data.map((item: { id: number; name: string }) => ({
// 		label: item.name,
// 		value: item.id,
// 	}));
// };

type Category = {
	id: number;
	key: string;
	name: string;
};

const baseURL = "http://localhost:3000";

// APIからカテゴリリストを取得する関数
const fetchCategories = async (searchName?: string): Promise<Category[]> => {
	const response = await axios.get(`${baseURL}/api/category`, {
		params: { searchName }, // searchNameクエリパラメータをAPIに送る
	});
	return response.data; // APIから取得したデータをそのまま返す
};

// カスタムフック: カテゴリのオプションを取得
export const useCategoryOptions = (searchName: string) => {
	return useQuery({
		queryKey: ["categories", searchName], // クエリキーをsearchNameに基づいて更新
		queryFn: () => fetchCategories(searchName), // クエリ関数
		enabled: true, // 初期ロード時もクエリを実行
	});
};
