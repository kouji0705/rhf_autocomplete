import type React from "react";
import { useEffect, useState, useCallback } from "react";

// カテゴリの型定義
interface Category {
	id: number;
	key: string;
	name: string;
}

interface SubCategory {
	id: number;
	key: string;
	name: string;
}

const CategoryForm: React.FC = () => {
	const [categories, setCategories] = useState<Category[]>([]);
	const [subCategories, setSubCategories] = useState<SubCategory[]>([]);
	const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(
		null,
	);

	// 大分類を取得する関数をuseCallbackでメモ化
	const fetchCategories = useCallback(async () => {
		const response = await fetch("http://localhost:4000/api/category");
		const data = await response.json();
		setCategories(data);
	}, []); // 依存配列に空を指定して、初回レンダリング時のみ再生成

	// 小分類を取得する関数をuseCallbackでメモ化
	const fetchSubCategories = useCallback(async (categoryId: number) => {
		const response = await fetch(
			`http://localhost:4000/api/category/${categoryId}`,
		);
		const data = await response.json();
		setSubCategories(data);
	}, []); // 空の依存配列で再定義を防止

	// 初回レンダリング時に大分類を取得
	useEffect(() => {
		fetchCategories(); // メモ化されたfetchCategoriesを使用
	}, [fetchCategories]); // fetchCategoriesを依存配列に追加

	// 大分類が選択された時に、小分類を取得
	useEffect(() => {
		if (selectedCategoryId !== null) {
			fetchSubCategories(selectedCategoryId); // メモ化されたfetchSubCategoriesを使用
		}
	}, [selectedCategoryId, fetchSubCategories]); // fetchSubCategoriesも依存配列に追加

	return (
		<div>
			<label>大分類:</label>
			<select
				onChange={(e) => setSelectedCategoryId(Number(e.target.value))}
				defaultValue=""
			>
				<option value="" disabled>
					選択してください
				</option>
				{categories.map((category) => (
					<option key={category.id} value={category.id}>
						{category.name}
					</option>
				))}
			</select>

			{/* 小分類のセレクトボックス */}
			{selectedCategoryId && (
				<div>
					<label>小分類:</label>
					<select defaultValue="">
						<option value="" disabled>
							選択してください
						</option>
						{subCategories.map((subCategory) => (
							<option key={subCategory.id} value={subCategory.id}>
								{subCategory.name}
							</option>
						))}
					</select>
				</div>
			)}
		</div>
	);
};

export default CategoryForm;
