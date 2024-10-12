import React, { useEffect, useState, useCallback, useMemo } from "react";
import { Controller, useForm } from "react-hook-form";
import { Autocomplete, TextField, FormControl } from "@mui/material";
import axios from "axios";
import debounce from "lodash/debounce";

interface Category {
	id: number;
	name: string;
}

export const CategoryFormWithDebounce: React.FC = () => {
	const { control } = useForm({
		defaultValues: {
			category: undefined, // 初期値をundefinedに設定
		},
	});

	const [categories, setCategories] = useState<Category[]>([]); // APIから取得したカテゴリを保持
	const [inputValue, setInputValue] = useState(""); // ユーザーの入力値を保持

	// APIから大分類を取得する関数（クエリパラメータを使用）
	const fetchCategories = useCallback(async (searchName: string) => {
		try {
			const response = await axios.get<Category[]>(
				"http://localhost:3000/api/category",
				{
					params: { searchName }, // クエリパラメータに検索文字を設定
				},
			);
			setCategories(response.data); // APIから取得したデータをセット
		} catch (error) {
			console.error("Error fetching categories:", error);
		}
	}, []);

	// debouncedFetchCategoriesを作成して、API呼び出しを遅延
	const debouncedFetchCategories = useMemo(
		() => debounce((searchName: string) => fetchCategories(searchName), 500), // 500ms遅らせる
		[fetchCategories],
	);

	// inputValueが変更されたときにAPIを呼び出す（debouncedFetchCategoriesを使用）
	useEffect(() => {
		if (inputValue) {
			debouncedFetchCategories(inputValue); // 入力値がある場合にAPIを呼び出す
		} else {
			fetchCategories(""); // 入力値が空の場合、全件取得（もしくは空の結果）
		}
	}, [inputValue, debouncedFetchCategories, fetchCategories]);

	// クリーンアップ用に、コンポーネントがアンマウントされた際にdebounceのタイマーをクリアする
	useEffect(() => {
		return () => {
			debouncedFetchCategories.cancel(); // コンポーネントのアンマウント時にdebounceをキャンセル
		};
	}, [debouncedFetchCategories]);

	return (
		<form>
			{/* 大分類のAutocomplete */}
			<FormControl fullWidth>
				<Controller
					name="category"
					control={control}
					render={({ field }) => (
						<Autocomplete
							{...field}
							options={categories} // APIから取得したデータをセット
							getOptionLabel={(option) => option.name} // カテゴリ名を表示
							value={field.value || undefined} // field.valueがnullの場合undefinedをセット
							onChange={(_, newValue) => field.onChange(newValue)} // 選択されたオブジェクトをフォームに反映
							inputValue={inputValue} // ユーザーの入力値を表示
							onInputChange={(_, newInputValue) => setInputValue(newInputValue)} // ユーザーの入力値を追跡
							disableClearable // バツボタンを非表示にする
							renderInput={(params) => (
								<TextField {...params} label="大分類を検索" />
							)}
							sx={{ width: 300 }}
						/>
					)}
				/>
			</FormControl>
		</form>
	);
};
