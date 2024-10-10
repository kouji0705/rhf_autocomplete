import React, { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { TextField, Autocomplete, Button, Box } from '@mui/material';
import axios from 'axios';

type FormValues = {
  user: { label: string; value: number };
  product: { label: string; value: number };
};

// APIレスポンスの型定義
interface UserResponse {
  id: number;
  name: string;
}

interface ProductResponse {
    id: number;
    title: string;
  }
  

type Option = {
  label: string;
  value: number;
};

// APIからデータを取得する関数
const fetchOptions = async (url: string, query?: string): Promise<Option[]> => {
  try {
    const response = await axios.get<UserResponse[]>(url, {
      params: { q: query },
    });
    return response.data.map((item) => ({
      label: item.name,
      value: item.id,
    }));
  } catch (error) {
    console.error("Error fetching data:", error);
    return [];
  }
};

const fetchProductOptions = async (url: string, query?: string): Promise<Option[]> => {
    try {
      const response = await axios.get<ProductResponse[]>(url, {
        params: { q: query },
      });
      return response.data.map((item) => ({
        label: item.title,
        value: item.id,
      }));
    } catch (error) {
      console.error("Error fetching data:", error);
      return [];
    }
  };



export const MultipleSearchAutocomplete = () => {
  const { control, handleSubmit } = useForm<FormValues>();
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
    }
  };

  // プロダクトが入力された時にAPIを呼び出す関数
  const handleProductInputChange = async (value: string) => {
    if (value) {
      const filteredOptions = await fetchOptions("https://jsonplaceholder.typicode.com/posts", value);
      setProductOptions(filteredOptions);
    }
  };

  // フォームの送信処理
  const onSubmit = (data: FormValues) => {
    console.log('選択されたデータ:', data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {/* ユーザー検索用オートコンプリート */}
      <Controller
        name="user"
        control={control}
        render={({ field }) => (
          <Autocomplete
            {...field}
            sx={{ width: 300 }}
            options={userOptions}
            getOptionLabel={(option) => option.label}
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
            getOptionLabel={(option) => option.label}
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

      {/* 送信ボタン */}
      <Box mt={2}>
        <Button variant="contained" color="primary" type="submit">
          送信
        </Button>
      </Box>
    </form>
  );
};