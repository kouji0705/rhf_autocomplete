import React, { useEffect, useState } from "react";
import { useForm, Controller, type Control } from "react-hook-form";
import { TextField, Autocomplete } from "@mui/material";
import axios from "axios";

type FormValues = {
	user: { label: string; value: number };
	product: { label: string; value: number };
};

type Option = {
	label: string;
	value: number;
};

// APIからデータを取得する汎用関数
const fetchOptions = async <
	T extends { id: number; name?: string; title?: string },
>(
	url: string,
	query?: string,
	labelKey: keyof T = "name", // デフォルトを "name" に設定
): Promise<Option[]> => {
	try {
		const response = await axios.get<T[]>(url, { params: { q: query } });
		return response.data.map((item) => ({
			label: String(item[labelKey]),
			value: item.id,
		}));
	} catch (error) {
		console.error("Error fetching data:", error);
		return [];
	}
};

// Autocomplete 共通コンポーネント
const SearchAutocomplete = ({
	name,
	control,
	label,
	options,
	onInputChange,
}: {
	name: keyof FormValues;
	control: Control<FormValues>;
	label: string;
	options: Option[];
	onInputChange: (value: string) => void;
}) => (
	<Controller
		name={name}
		control={control}
		render={({ field }) => (
			<Autocomplete
				{...field}
				sx={{ width: 300 }}
				options={options}
				getOptionLabel={(option) => option?.label || ""} // オプションのラベルを取得
				onInputChange={(event, value) => onInputChange(value)} // ユーザー入力時の処理
				renderInput={(params) => (
					<TextField {...params} label={label} variant="outlined" />
				)}
				onChange={(event, value) => field.onChange(value)} // 選択時にフィールドを更新
				clearOnEscape // Escapeキーでクリア可能
				clearText="クリア" // バツボタンのラベルを設定
			/>
		)}
	/>
);

export const MultipleSearchAutocomplete2 = () => {
	const { control } = useForm<FormValues>();

	const [userOptions, setUserOptions] = useState<Option[]>([]);
	const [productOptions, setProductOptions] = useState<Option[]>([]);

	// 初回ロード時に全オプションを取得
	useEffect(() => {
		const loadInitialOptions = async () => {
			const initialUserOptions = await fetchOptions(
				"https://jsonplaceholder.typicode.com/users",
			);
			const initialProductOptions = await fetchOptions(
				"https://jsonplaceholder.typicode.com/posts",
				undefined,
				"title",
			);
			setUserOptions(initialUserOptions);
			setProductOptions(initialProductOptions);
		};
		loadInitialOptions();
	}, []);

	// ユーザー検索用の入力処理
	const handleUserInputChange = async (value: string) => {
		const filteredOptions = value
			? await fetchOptions("https://jsonplaceholder.typicode.com/users", value)
			: await fetchOptions("https://jsonplaceholder.typicode.com/users"); // クリア時に全ユーザーを表示
		setUserOptions(filteredOptions);
	};

	// プロダクト検索用の入力処理
	const handleProductInputChange = async (value: string) => {
		const filteredOptions = value
			? await fetchOptions(
					"https://jsonplaceholder.typicode.com/posts",
					value,
					"title",
				)
			: await fetchOptions(
					"https://jsonplaceholder.typicode.com/posts",
					undefined,
					"title",
				); // クリア時に全プロダクトを表示
		setProductOptions(filteredOptions);
	};

	return (
		<form>
			{/* ユーザー検索用オートコンプリート */}
			<SearchAutocomplete
				name="user"
				control={control}
				label="ユーザー検索"
				options={userOptions}
				onInputChange={handleUserInputChange}
			/>

			{/* プロダクト検索用オートコンプリート */}
			<SearchAutocomplete
				name="product"
				control={control}
				label="プロダクト検索"
				options={productOptions}
				onInputChange={handleProductInputChange}
			/>
		</form>
	);
};
