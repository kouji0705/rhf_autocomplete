import { useQuery } from "@tanstack/react-query";
import { fetchCategories, fetchProduct, fetchSubCategories } from "./api";
import type { FormValues, Product } from "./type";
import { useForm } from "react-hook-form";

// カスタムフック: カテゴリのオプションを取得
export const useCategoryOptions = (searchName: string) => {
	return useQuery({
		queryKey: ["categories", searchName], // クエリキーをsearchNameに基づいて更新
		queryFn: () => fetchCategories(searchName), // クエリ関数
		enabled: true, // 初期ロード時もクエリを実行
	});
};

// サブカテゴリのオプションを取得するカスタムフック
export const useSubCategoryOptions = (
	categoryId: number | null,
	searchName: string,
) => {
	return useQuery({
		queryKey: ["subCategories", categoryId, searchName], // categoryIdとsearchNameに基づいてクエリを実行
		queryFn: () => {
			if (categoryId === null) {
				return Promise.resolve([]); // categoryIdがnullの場合は空配列を返す
			}
			return fetchSubCategories(categoryId, searchName); // サブカテゴリーのAPI呼び出し
		},
		enabled: !!categoryId, // categoryIdがnullでない場合のみ実行
	});
};

// 製品データを取得するカスタムフック
export const useProductQuery = (productId: number) => {
	return useQuery({
		queryKey: ["product", productId], // 製品IDに基づいてクエリを実行
		queryFn: () => fetchProduct(productId), // 製品データの取得
	});
};

export const useSearchAutocomplete = (product: Product) => {
	const {
		control,
		watch,
		setValue,
		formState: { dirtyFields },
		reset,
	} = useForm<FormValues>({
		defaultValues: {
			category: product.category,
			subCategory: product.subCategory,
		},
	});

	// 親カテゴリーの監視
	const selectedCategory = watch("category");
	const categoryId = selectedCategory?.id || null;

	// 親カテゴリーの検索に基づくオプションを取得
	const { data: categoryOptions = [], isLoading: isCategoryLoading } =
		useCategoryOptions(selectedCategory?.name || "");

	// サブカテゴリー検索のための監視
	const subCategorySearchName = watch("subCategory")?.name || "";

	// サブカテゴリーのオプションを取得
	const { data: subCategoryOptions = [], isLoading: isSubCategoryLoading } =
		useSubCategoryOptions(categoryId, subCategorySearchName);

	const onSubmit = () => {
		console.log("onSubmit", dirtyFields);
	};

	const onCancel = () => {
		reset(); // フォームの値を初期値にリセット
	};

	return {
		control,
		categoryOptions,
		isCategoryLoading,
		subCategoryOptions,
		isSubCategoryLoading,
		setValue,
		dirtyFields,
		onSubmit,
		onCancel,
	};
};
