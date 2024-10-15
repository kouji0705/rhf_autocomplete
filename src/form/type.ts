// カテゴリの型定義

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

// Category型
export type Category = {
	id: number;
	key: string;
	name: string;
};

// FormValuesの型定義
export type FormValues = {
	category: Category | null; // 親カテゴリー
	subCategory: Category | null; // サブカテゴリー
};
