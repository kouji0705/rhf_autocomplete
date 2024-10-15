import axios from "axios";
import type {
	Category,
	PullDownOption,
	SubCategory,
	UserResponse,
} from "./type";

const baseUrl = "http://localhost:3000/api";



export const fetchUserOptions = async (
	query?: string,
): Promise<PullDownOption[]> => {
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
