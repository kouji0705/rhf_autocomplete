import type React from "react";
import { useEffect, useState, useCallback } from "react";
import { Controller, useForm } from "react-hook-form";
import { Autocomplete, TextField, FormControl } from "@mui/material";
import axios from "axios";

interface Category {
	id: number;
	name: string;
}

interface FormValues {
	categoryId: number | null; // id を保存するフィールド
}

export const CategoryFormWithSearch: React.FC = () => {
	const { control } = useForm<FormValues>({
		defaultValues: {
			categoryId: null, // 初期値は null
		},
	});

	const [categories, setCategories] = useState<Category[]>([]); // プルダウンの選択肢
	const [inputValue, setInputValue] = useState(""); // 入力された検索値

	// APIから大分類データを取得する関数
	const fetchCategories = useCallback(async (searchName: string) => {
		try {
			const response = await axios.get<Category[]>(
				"http://localhost:3000/api/category",
				{
					params: { searchName }, // 検索クエリをAPIに送信
				},
			);
			setCategories(response.data); // 取得したデータをセット
		} catch (error) {
			console.error("Error fetching categories:", error);
		}
	}, []);

	// コンポーネントの初回レンダリング時に全ての大分類を取得
	useEffect(() => {
		fetchCategories(""); // 初回は検索クエリなしで全件取得
	}, [fetchCategories]);

	return (
		<form>
			<FormControl fullWidth>
				<Controller
					name="categoryId" // フォームにidを保持
					control={control}
					render={({ field }) => (
						<Autocomplete
							options={categories} // APIから取得した選択肢
							getOptionLabel={(option) => option.name} // 表示は name
							value={
								categories.find((category) => category.id === field.value) ||
								null
							} // idに基づいて選択されたオプションを表示
							onChange={(_, newValue) => {
								field.onChange(newValue ? newValue.id : null); // idをフォームにセット
							}}
							inputValue={inputValue} // 検索用の入力値
							onInputChange={(_, newInputValue) => {
								setInputValue(newInputValue);
								if (newInputValue === "") {
									field.onChange(null); // 文字が空になったら選択をクリア
									fetchCategories(""); // クリア後、全件取得を呼び出す
								}
							}}
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
