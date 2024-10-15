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

export interface UserResponse {
	id: number;
	name: string;
}

export type PullDownOption = {
	label: string;
	value: number;
};
