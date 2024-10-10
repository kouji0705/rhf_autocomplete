import React, { useState, useEffect } from "react";
import { TextField, Autocomplete, CircularProgress } from "@mui/material";
import axios from "axios";
import _ from "lodash"; // Debounce を利用

type SearchOption = {
	label: string;
	value: string;
};

export const SearchAutocomplete = () => {
	const [searchTerm, setSearchTerm] = useState("");
	const [options, setOptions] = useState<SearchOption[]>([]);
	const [loading, setLoading] = useState(false);

	// API通信を行い、検索結果を取得する関数
	const fetchOptions = async (query: string) => {
		setLoading(true);
		try {
			const response = await axios.get("/api/search", { params: { q: query } });
			const results = response.data.map((item: any) => ({
				label: item.name,
				value: item.id,
			}));
			setOptions(results);
		} catch (error) {
			console.error("Error fetching data", error);
		} finally {
			setLoading(false);
		}
	};

	// Debounce処理を使って検索文字列が更新されたらAPIリクエスト
	const debouncedFetch = _.debounce((query: string) => {
		if (query.length > 0) {
			fetchOptions(query);
		} else {
			setOptions([]); // クエリが空の場合、オプションもクリア
		}
	}, 500); // 500ms の遅延

	// ユーザーの入力が変わったときに処理
	useEffect(() => {
		debouncedFetch(searchTerm);
		// クリーンアップ関数でdebouncedFetchをキャンセル
		return () => {
			debouncedFetch.cancel();
		};
	}, [debouncedFetch, searchTerm]);

	return (
		<Autocomplete
			options={options}
			getOptionLabel={(option) => option.label}
			onInputChange={(event, newInputValue) => setSearchTerm(newInputValue)}
			loading={loading}
			renderInput={(params) => (
				<TextField
					{...params}
					label="Search"
					InputProps={{
						...params.InputProps,
						endAdornment: (
							<>
								{loading ? (
									<CircularProgress color="inherit" size={20} />
								) : null}
								{params.InputProps.endAdornment}
							</>
						),
					}}
				/>
			)}
		/>
	);
};
