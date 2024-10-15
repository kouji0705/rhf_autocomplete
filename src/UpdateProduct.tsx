import type React from "react";
import { Suspense } from "react";
import { Button } from "@mui/material";
import { SearchAutocomplete } from "./form/Form";
import { useProductQuery, useSearchAutocomplete } from "./form/hooks";
import type { Product } from "./form/type";

const PRODUCT_ID = 1;

// 製品データ取得後に表示するコンポーネント
const UpdateProductComponent = ({ product }: { product: Product }) => {
	const {
		control,
		categoryOptions,
		isCategoryLoading,
		subCategoryOptions,
		isSubCategoryLoading,
		setValue,
		dirtyFields,
		onSubmit,
		onCancel,
	} = useSearchAutocomplete(product);

	return (
		<div>
			<h1>UpdateProduct</h1>
			<SearchAutocomplete
				control={control}
				categoryOptions={categoryOptions}
				isCategoryLoading={isCategoryLoading}
				subCategoryOptions={subCategoryOptions}
				isSubCategoryLoading={isSubCategoryLoading}
				setValue={setValue}
			/>
			{dirtyFields && (
				<div>
					{Object.keys(dirtyFields).length > 0
						? "以下のフィールドが変更されました:"
						: "変更はありません"}
					<ul>
						{Object.keys(dirtyFields).map((field) => (
							<li key={field}>{field}</li>
						))}
					</ul>
					<Button
						onClick={onSubmit}
						sx={{ width: 300, backgroundColor: "blue", color: "white" }}
					>
						保存
					</Button>
					<Button onClick={onCancel}>キャンセル</Button>
				</div>
			)}
		</div>
	);
};

// Suspenseによるローディング処理のラップ
export const UpdateProduct = () => {
	return (
		<Suspense fallback={<div>Loading...</div>}>
			<ProductLoader />
		</Suspense>
	);
};

// 非同期に製品をロードしてから表示するコンポーネント
const ProductLoader: React.FC = () => {
	const { data: product, isLoading } = useProductQuery(PRODUCT_ID);

	if (isLoading || !product) {
		return <div>Loading...</div>; // ローディング状態の表示
	}

	return <UpdateProductComponent product={product} />;
};
