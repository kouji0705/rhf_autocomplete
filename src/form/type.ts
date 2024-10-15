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

// export type FormValues = {
// 	user: { label: string; value: number } | null;
// };

// Category型
export type Category = {
	id: number;
	key: string;
	name: string;
};

// FormValuesの型定義
export type FormValues = {
	user: Category | null; // userはCategory型またはnull
};
