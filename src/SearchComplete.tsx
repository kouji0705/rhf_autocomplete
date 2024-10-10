import React, { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { TextField, Autocomplete, CircularProgress } from '@mui/material';
import axios from 'axios';

type FormValues = {
  user: { label: string; value: number };
};

export const SearchAutocomplete = () => {
  const { control, handleSubmit } = useForm<FormValues>();
  const [options, setOptions] = useState<Array<{ label: string; value: number }>>([]);
  const [loading, setLoading] = useState(false);

  // 初回にすべてのオプションをロードする
  useEffect(() => {
    const fetchInitialOptions = async () => {
      setLoading(true);
      try {
        const response = await axios.get("https://jsonplaceholder.typicode.com/users");
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
    fetchInitialOptions(); // 初回ロード
  }, []);

  const fetchOptions = async (query: string) => {
    setLoading(true);
    try {
      const response = await axios.get("https://jsonplaceholder.typicode.com/users", {
        params: { q: query }, // jsonplaceholderではフィルタリングされない例
      });
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
            onInputChange={(event, value) => {
              if (value) {
                fetchOptions(value); // ユーザーが入力するたびにAPI呼び出し
              }
            }}
            loading={loading}
            renderInput={(params) => (
              <TextField
                {...params}
                label="ユーザー検索"
                variant="outlined"
                InputProps={{
                  ...params.InputProps,
                  endAdornment: (
                    <>
                      {loading ? <CircularProgress color="inherit" size={20} /> : null}
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