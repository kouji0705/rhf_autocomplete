import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { TextField, Autocomplete } from "@mui/material";
import axios from "axios";
import {
	useQuery,
	QueryClient,
	QueryClientProvider,
} from "@tanstack/react-query";

// クエリクライアントの初期化
const queryClient = new QueryClient();

// APIレスポンスの型定義
interface UserResponse {
	id: number;
	name: string;
}

type Option = {
	label: string;
	value: number;
};

type FormValues = {
	user: { label: string; value: number } | null;
};

// APIからユーザーリストを取得する関数
const fetchUserOptions = async (query?: string): Promise<Option[]> => {
	const response = await axios.get<UserResponse[]>(
		"https://jsonplaceholder.typicode.com/users",
		{
			params: { q: query },
		},
	);
	return response.data.map((item) => ({
		label: item.name,
		value: item.id,
	}));
};

// ユーザー検索のためのAutocompleteコンポーネント
export const SearchAutocompleteComponent = () => {
	const { control, handleSubmit } = useForm<FormValues>({
		defaultValues: {
			user: null,
		},
	});
	const [searchQuery, setSearchQuery] = useState("");

	// 初期ロードまたは検索結果を取得するためのクエリ
	const { data: options = [], isLoading } = useQuery({
		queryKey: ["users", searchQuery], // クエリキーをオブジェクトで渡す
		queryFn: () => fetchUserOptions(searchQuery), // クエリ関数
		enabled: true, // 検索クエリがあるときのみ実行
	});

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
									endAdornment: (
										<>
											{isLoading ? <div>Loading...</div> : null}
											{params.InputProps.endAdornment}
										</>
									),
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
