import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { TextField, Autocomplete } from "@mui/material";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useUserOptions } from "./hooks";

// クエリクライアントの初期化
const queryClient = new QueryClient();

type FormValues = {
	user: { label: string; value: number } | null;
};

// ユーザー検索のためのAutocompleteコンポーネント
export const SearchAutocompleteComponent = () => {
	const { control, handleSubmit } = useForm<FormValues>({
		defaultValues: {
			user: null,
		},
	});
	const [searchQuery, setSearchQuery] = useState("");

	// カスタムフックを使ってクエリを実行
	const { data: options = [], isLoading } = useUserOptions(searchQuery);

	// ユーザーが入力した際にAPIを呼び出す関数
	const handleInputChange = (value: string) => {
		setSearchQuery(value); // 検索クエリを更新し、クエリを再実行
	};

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
						onInputChange={(event, value) => handleInputChange(value)} // ユーザー入力時にAPIを呼び出し
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

// QueryClientProviderでアプリ全体にクエリクライアントを提供
export const SearchAutocomplete = () => {
	return (
		<QueryClientProvider client={queryClient}>
			<SearchAutocompleteComponent />
		</QueryClientProvider>
	);
};
