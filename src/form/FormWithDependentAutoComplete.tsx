import React, { useEffect, useState, useCallback } from "react";
import { Controller, useForm } from "react-hook-form";
import { Autocomplete, TextField, FormControl } from "@mui/material";
import axios from "axios";

interface Category {
	id: number;
	name: string;
}

export const CategoryFormWithSearch: React.FC = () => {
	const { control } = useForm({
		defaultValues: {
			category: null, // 初期値はnull
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

	// inputValueが変更されたときにAPIを呼び出す
	useEffect(() => {
		if (inputValue) {
			fetchCategories(inputValue); // 入力値がある場合にAPIを呼び出す
		} else {
			fetchCategories(""); // 入力値が空の場合、全件取得（もしくはそのまま空の結果）
		}
	}, [inputValue, fetchCategories]);

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
							onChange={(_, newValue) => field.onChange(newValue)} // 選択されたオブジェクトをフォームに反映
							inputValue={inputValue} // ユーザーの入力値を表示
							onInputChange={(_, newInputValue) => setInputValue(newInputValue)} // ユーザーの入力値を追跡
							renderInput={(params) => (
								<TextField {...params} label="大分類を検索" />
							)}
						/>
					)}
				/>
			</FormControl>
		</form>
	);
};
