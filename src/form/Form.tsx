import React from "react";
import { useForm, Controller } from "react-hook-form";
import { TextField, Autocomplete } from "@mui/material";
import { useUserOptions } from "./hooks";
import type { FormValues } from "./type";

// ユーザー検索のためのAutocompleteコンポーネント
export const SearchAutocomplete = () => {
	const { control, handleSubmit, watch } = useForm<FormValues>({
		defaultValues: {
			user: null,
		},
	});

	// watchを使ってuserフィールドの値を監視
	const searchQuery = watch("user")?.label || ""; // userのラベル（検索文字列）を取得

	// カスタムフックを使ってクエリを実行
	const { data: options = [], isLoading } = useUserOptions(searchQuery);

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
						getOptionLabel={(option) => option.label}
						loading={isLoading}
						// onInputChangeの処理はwatchで代替されるので削除可能
						renderInput={(params) => (
							<TextField
								{...params}
								label="ユーザー検索"
								variant="outlined"
								InputProps={{
									...params.InputProps,
								}}
							/>
						)}
						onChange={(event, value) => field.onChange(value)} // 選択時にフィールドを更新
					/>
				)}
			/>
		</form>
	);
};
