import axios from "axios";
import type { Category, Product } from "./type";

export const apiClient = axios.create({
	baseURL: "http://localhost:3000", // 共通のBaseURL
});

// APIからカテゴリリストを取得する関数
export const fetchCategories = async (
	searchName?: string,
): Promise<Category[]> => {
	const response = await apiClient.get<Category[]>("/api/category", {
		params: { searchName }, // searchNameクエリパラメータをAPIに送る
	});
	return response.data; // APIから取得したデータをそのまま返す
};

// APIからサブカテゴリリストを取得する関数
export const fetchSubCategories = async (
	categoryId: number,
	searchName?: string,
): Promise<Category[]> => {
	const response = await apiClient.get<Category[]>(
		`/api/category/${categoryId}`,
		{
			params: { searchName }, // searchNameクエリパラメータとして渡す
		},
	);
	return response.data;
};

// 製品データを取得するAPI
export const fetchProduct = async (productId: number) => {
	const response = await axios.get<Product>(`/api/product/${productId}`);
	return response.data;
};
