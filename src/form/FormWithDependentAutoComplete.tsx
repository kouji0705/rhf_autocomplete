import React, { Suspense, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { TextField, Autocomplete } from "@mui/material";
import axios from "axios";

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
	user: { label: string; value: number };
};

// 非同期データ取得ロジック
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

// データを読み込んでキャッシュする関数
const userOptionsCache: {
	promise: Promise<Option[]> | null;
	data: Option[] | null;
} = {
	promise: null,
	data: null,
};

const loadUserOptions = () => {
	if (!userOptionsCache.promise) {
		userOptionsCache.promise = fetchUserOptions().then((data) => {
			userOptionsCache.data = data;
		});
	}
	if (userOptionsCache.data) {
		return userOptionsCache.data;
	}
	throw userOptionsCache.promise; // Suspenseで待機対象にする
};

// Suspenseで使うローディングコンポーネント
const Loading = () => <div>Loading...</div>;

// ユーザー検索のためのAutocompleteコンポーネント
const SearchAutocompleteComponent = () => {
	const { control, handleSubmit } = useForm<FormValues>();
	const options = loadUserOptions(); // 初回に全ユーザーを取得

	const handleInputChange = async (value: string) => {
		if (value) {
			const filteredOptions = await fetchUserOptions(value);
			userOptionsCache.data = filteredOptions; // キャッシュを更新
		}
	};

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
						onInputChange={(event, value) => handleInputChange(value)} // ユーザー入力時にAPIを呼び出し
						renderInput={(params) => (
							<TextField {...params} label="ユーザー検索" variant="outlined" />
						)}
						onChange={(event, value) => field.onChange(value)} // 選択時にフィールドを更新
					/>
				)}
			/>
		</form>
	);
};

// Suspenseを利用してデータを取得してから表示
export const SearchAutocomplete = () => {
	return (
		<Suspense fallback={<Loading />}>
			<SearchAutocompleteComponent />
		</Suspense>
	);
};
