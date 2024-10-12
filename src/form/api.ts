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
