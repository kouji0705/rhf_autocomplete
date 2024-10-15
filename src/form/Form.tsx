import React from "react";
import { useForm, Controller } from "react-hook-form";
import { TextField, Autocomplete } from "@mui/material";
import { useUserOptions } from "./hooks"; // カスタムフック
import type { FormValues, Category } from "./type"; // 型定義

// ユーザー検索のためのAutocompleteコンポーネント
export const SearchAutocomplete = () => {
	const { control, handleSubmit, watch } = useForm<FormValues>({
		defaultValues: {
			user: null,
		},
	});

	// watchを使ってuserフィールドの値を監視し、検索文字列を取得
	const searchName = watch("user")?.name || ""; // name（検索文字列）を取得
	console.log("searchName:", searchName);

	// カスタムフックを使ってクエリを実行
	const { data: options = [], isLoading } = useUserOptions(searchName);

	// フォームの送信処理
	const onSubmit = (data: FormValues) => {
		console.log("選択されたデータ:", data);
	};

	return (
		<form onSubmit={handleSubmit(onSubmit)}>
			<Controller
				name="user"
				control={control}
				render={({ field }) => (
					<Autocomplete
						{...field}
						sx={{ width: 300 }}
						options={options}
						getOptionLabel={(option: Category) => option.name} // nameフィールドを表示
						loading={isLoading}
						value={field.value} // 選択された値を表示
						onChange={(event, value) => field.onChange(value)} // 選択時にフィールドを更新
						renderInput={(params) => (
							<TextField
								{...params}
								label="カテゴリ検索"
								variant="outlined"
								InputProps={{
									...params.InputProps,
								}}
							/>
						)}
					/>
				)}
			/>
		</form>
	);
};
