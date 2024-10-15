import React, { useEffect, useState } from "react";
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
	user: { label: string; value: number } | null;
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

// ユーザー検索のためのAutocompleteコンポーネント
export const SearchAutocomplete = () => {
	const { control, handleSubmit } = useForm<FormValues>({
		defaultValues: {
			user: null,
		},
	});
	const [options, setOptions] = useState<Option[]>([]);
	const [loading, setLoading] = useState(false);

	// 初回に全ユーザーをロードするためのuseEffect
	useEffect(() => {
		const loadInitialOptions = async () => {
			setLoading(true);
			const initialOptions = await fetchUserOptions(); // 初回に全ユーザーを取得
			setOptions(initialOptions);
			setLoading(false);
		};
		loadInitialOptions(); // 初回ロード時にAPIを呼び出す
	}, []);

	// ユーザーが入力した際にAPIを呼び出す関数
	const handleInputChange = async (value: string) => {
		if (value) {
			setLoading(true);
			const filteredOptions = await fetchUserOptions(value);
			setOptions(filteredOptions);
			setLoading(false);
		}
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
						loading={loading}
						onInputChange={(event, value) => handleInputChange(value)} // ユーザー入力時にAPIを呼び出し
						renderInput={(params) => (
							<TextField
								{...params}
								label="ユーザー検索"
								variant="outlined"
								InputProps={{
									...params.InputProps,
									endAdornment: <>{params.InputProps.endAdornment}</>,
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
