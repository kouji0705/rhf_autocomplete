import { useQuery } from "@tanstack/react-query";
import axios from "axios";

type Category = {
	id: number;
	key: string;
	name: string;
};

const apiClient = axios.create({
	baseURL: "http://localhost:3000", // 共通のBaseURL
});

// APIからカテゴリリストを取得する関数
export const fetchCategories = async (
	searchName?: string,
): Promise<Category[]> => {
	const response = await apiClient.get("/api/category", {
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

// APIからサブカテゴリリストを取得する関数
export const fetchSubCategories = async (
	categoryId: number,
	searchName?: string,
): Promise<Category[]> => {
	const response = await apiClient.get(`/api/category/${categoryId}`, {
		params: { searchName }, // searchNameクエリパラメータとして渡す
	});
	return response.data;
};
// サブカテゴリのオプションを取得するカスタムフック
export const useSubCategoryOptions = (
	categoryId: number | null,
	searchName: string,
) => {
	return useQuery({
		queryKey: ["subCategories", categoryId, searchName], // categoryIdとsearchNameに基づいてクエリを実行
		queryFn: () => {
			if (categoryId === null) {
				return Promise.resolve([]); // categoryIdがnullの場合は空配列を返す
			}
			return fetchSubCategories(categoryId, searchName); // サブカテゴリーのAPI呼び出し
		},
		enabled: !!categoryId, // categoryIdがnullでない場合のみ実行
	});
};
