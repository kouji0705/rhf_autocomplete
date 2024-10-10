import React, { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { TextField, Autocomplete } from '@mui/material';
import axios from 'axios';

type FormValues = {
  user: { label: string; value: number };
  product: { label: string; value: number };
};

interface ProductResponse {
  id: number;
  title: string;
}

type Option = {
  label: string;
  value: number;
};

// APIからデータを取得する関数
const fetchOptions = async <T extends { id: number; name?: string; title?: string }>(
  url: string,
  query?: string,
  labelKey: keyof T = "name"
): Promise<Option[]> => {
  try {
    const response = await axios.get<T[]>(url, {
      params: { q: query },
    });
    return response.data.map((item) => ({
      label: String(item[labelKey]), // labelをstringに変換
      value: item.id,
    }));
  } catch (error) {
    console.error("Error fetching data:", error);
    return [];
  }
};

const fetchProductOptions = async (
  url: string,
  query?: string
): Promise<Option[]> => {
  try {
    const response = await axios.get<ProductResponse[]>(url, {
      params: { 'user_id': query }, // クエリパラメータの変更も確認
    });
    return response.data.map((item) => ({
      label: item.title, // titleを使用
      value: item.id,
    }));
  } catch (error) {
    console.error("Error fetching data:", error);
    return [];
  }
};

export const MultipleSearchAutocomplete = () => {
  const { control } = useForm<FormValues>();
  const [userOptions, setUserOptions] = useState<Option[]>([]);
  const [productOptions, setProductOptions] = useState<Option[]>([]);

  // 初回に全オプションをロードするための useEffect
  useEffect(() => {
    const loadInitialOptions = async () => {
      const initialUserOptions = await fetchOptions("https://jsonplaceholder.typicode.com/users");
      const initialProductOptions = await fetchProductOptions("https://jsonplaceholder.typicode.com/posts");
      setUserOptions(initialUserOptions);
      setProductOptions(initialProductOptions);
    };

    loadInitialOptions(); // 初回ロード時にデータを取得
  }, []);

  // ユーザーが入力した際にAPIを呼び出す関数
  const handleUserInputChange = async (value: string) => {
    if (value) {
      const filteredOptions = await fetchOptions("https://jsonplaceholder.typicode.com/users", value);
      setUserOptions(filteredOptions);
    } else {
      setUserOptions([]); // 入力がクリアされた場合にオプションをリセット
    }
  };

  // プロダクトが入力された時にAPIを呼び出す関数
  const handleProductInputChange = async (value: string) => {
    if (value) {
      const filteredOptions = await fetchProductOptions("https://jsonplaceholder.typicode.com/posts", value);
      setProductOptions(filteredOptions);
    } else {
      setProductOptions([]); // 入力がクリアされた場合にオプションをリセット
    }
  };


  return (
    <form>
      {/* ユーザー検索用オートコンプリート */}
      <Controller
        name="user"
        control={control}
        render={({ field }) => (
          <Autocomplete
            {...field}
            sx={{ width: 300 }}
            options={userOptions}
            getOptionLabel={(option) => {
              console.log("User Option:", option); // デバッグ用
              return option?.label || ''; // ラベルが存在する場合に表示
            }}
            onInputChange={(event, value) => handleUserInputChange(value)} // ユーザー入力時の処理
            renderInput={(params) => (
              <TextField
                {...params}
                label="ユーザー検索"
                variant="outlined"
              />
            )}
            onChange={(event, value) => field.onChange(value)} // 選択時にフィールドを更新
          />
        )}
      />

      {/* プロダクト検索用オートコンプリート */}
      <Controller
        name="product"
        control={control}
        render={({ field }) => (
          <Autocomplete
            {...field}
            sx={{ width: 300 }}
            options={productOptions}
            getOptionLabel={(option) => {
              console.log("Product Option:", option); // デバッグ用
              return option?.label || ''; // ラベルが存在する場合に表示
            }}
            onInputChange={(event, value) => handleProductInputChange(value)} // プロダクト入力時の処理
            renderInput={(params) => (
              <TextField
                {...params}
                label="プロダクト検索"
                variant="outlined"
              />
            )}
            onChange={(event, value) => field.onChange(value)} // 選択時にフィールドを更新
          />
        )}
      />
    </form>
  );
};