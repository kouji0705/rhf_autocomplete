import React, { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { TextField, Autocomplete } from '@mui/material';
import axios from 'axios';

type FormValues = {
  user: { label: string; value: number };
};

// APIレスポンスの型定義
interface UserResponse {
  id: number;
  name: string;
  // 必要に応じて他のフィールドを追加
}

type Option = {
  label: string;
  value: number;
};

// APIからデータを取得する関数
const fetchUserOptions = async (query?: string): Promise<Option[]> => {
  try {
    const response = await axios.get<UserResponse[]>("https://jsonplaceholder.typicode.com/users", {
      params: { q: query },
    });
    return response.data.map((item) => ({
      label: item.name,
      value: item.id,
    }));
  } catch (error) {
    console.error("Error fetching data", error);
    return [];
  }
};

export const SearchAutocomplete = () => {
  const { control, handleSubmit } = useForm<FormValues>();
  const [options, setOptions] = useState<Option[]>([]);

  // 初回に全オプションをロード
  useEffect(() => {
    const loadInitialOptions = async () => {
      const initialOptions = await fetchUserOptions(); // 初回に全てのユーザーを取得
      setOptions(initialOptions);
    };
    loadInitialOptions();
  }, []);

  // ユーザーが入力した際にAPIを呼び出す関数
  const handleInputChange = async (value: string) => {
    if (value) {
      const filteredOptions = await fetchUserOptions(value);
      setOptions(filteredOptions);
    }
  };

  // フォームの送信処理
  const onSubmit = (data: FormValues) => {
    console.log('選択されたデータ:', data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Controller
        name="user"
        control={control}
        render={({ field }) => (
          <Autocomplete
            {...field}
            options={options}
            getOptionLabel={(option) => option.label}
            onInputChange={(event, value) => handleInputChange(value)} // ユーザー入力時の処理
            renderInput={(params) => (
              <TextField
                {...params}
                label="ユーザー検索"
                variant="outlined"
                InputProps={{
                  ...params.InputProps,
                  endAdornment: (
                    <>
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
      <button type="submit">送信</button>
    </form>
  );
};