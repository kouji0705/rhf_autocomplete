import type { categories } from "./const";

// 大分類と小分類のデータ
export type CategoryKey = keyof typeof categories;

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
