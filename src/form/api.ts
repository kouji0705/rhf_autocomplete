import axios from "axios";
import type { Category, SubCategory } from "./type";

const baseUrl = "http://localhost:3000/api";

export const getCategories = async () => {
	const response = await axios.get<Category[]>(`${baseUrl}/category`);
	return response.data;
};

export const getSubCategories = async (categoryId: number) => {
	const response = await axios.get<SubCategory[]>(
		`${baseUrl}/category/${categoryId}`,
	);
	return response.data;
};

// 非同期データ取得ロジック
export const fetchUserOptions = async (query?: string): Promise<Option[]> => {
	const response = await axios.get<UserResponse[]>(
		"https://jsonplaceholder.typicode.com/users",
		{
			params: { q: query },
		},
	);
	return response.data.map((item) => ({
		label: item.name,
		value: item.id,
	}));
};
