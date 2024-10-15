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
