import axios from "axios";

type Category = {
	id: number;
	key: string;
	name: string;
};

export const apiClient = axios.create({
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
