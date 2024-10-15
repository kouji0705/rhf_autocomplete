import { useQuery } from "@tanstack/react-query";
import { fetchCategories, fetchSubCategories } from "./api";

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
