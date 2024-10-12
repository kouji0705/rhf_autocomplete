import React, { useEffect, useState } from "react";
import { useForm, Controller, type Control } from "react-hook-form";
import { TextField, Autocomplete } from "@mui/material";
import axios from "axios";

type FormValues = {
	user: { hashId: string; label: string; value: number };
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
		const response = await axios.get<T[]>(url, {
			params: query ? { userId: query } : {},
		});
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
				getOptionLabel={(option) => option?.label || ""}
				onInputChange={(event, value) => onInputChange(value)}
				renderInput={(params) => (
					<TextField {...params} label={label} variant="outlined" />
				)}
				onChange={(event, value) => field.onChange(value)}
			/>
		)}
	/>
);

export const MultipleSearchAutocomplete = () => {
	const { control, watch } = useForm<FormValues>();
	const [userOptions, setUserOptions] = useState<Option[]>([]);
	const [productOptions, setProductOptions] = useState<Option[]>([]);

	// 初回ロード時に全オプションを取得
	useEffect(() => {
		const loadInitialOptions = async () => {
			const initialUserOptions = await fetchOptions(
				"https://jsonplaceholder.typicode.com/users",
			);
			setUserOptions(initialUserOptions);
		};
		loadInitialOptions();
	}, []);

	// ユーザー検索用の入力処理
	const handleUserInputChange = async (value: string) => {
		const filteredOptions = value
			? await fetchOptions("https://jsonplaceholder.typicode.com/users", value)
			: [];
		setUserOptions(filteredOptions);
	};

	// User選択時の処理。選択されたuserIdを元にpostsを取得する
	const selectedUser = watch("user");
	useEffect(() => {
		const fetchProductOptionsForUser = async () => {
			if (selectedUser?.value) {
				const postsForUser = await fetchOptions(
					"https://jsonplaceholder.typicode.com/posts",
					String(selectedUser.value), // 選択されたuserIdをクエリパラメータに設定
					"title",
				);
				setProductOptions(postsForUser); // 取得したpostsをproductの選択肢として設定
			}
		};
		fetchProductOptionsForUser();
	}, [selectedUser]); // userが選択されたらAPIを再度叩く

	// プロダクト検索用の入力処理
	const handleProductInputChange = async (value: string) => {
		const filteredOptions = value
			? await fetchOptions(
					"https://jsonplaceholder.typicode.com/posts",
					value,
					"title",
				)
			: [];
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
