import { http } from "msw";

// 大分類のデータ
const categories = [
	{ id: 1, key: "food", name: "食べ物" },
	{ id: 2, key: "animal", name: "動物" },
	{ id: 3, key: "vehicle", name: "乗り物" },
];

// 小分類のデータ
const subCategories = {
	1: [
		{ id: 1, key: "apple", name: "りんご" },
		{ id: 2, key: "banana", name: "バナナ" },
		{ id: 3, key: "orange", name: "オレンジ" },
	],
	2: [
		{ id: 1, key: "dog", name: "犬" },
		{ id: 2, key: "cat", name: "猫" },
		{ id: 3, key: "elephant", name: "象" },
	],
	3: [
		{ id: 1, key: "car", name: "車" },
		{ id: 2, key: "bicycle", name: "自転車" },
		{ id: 3, key: "airplane", name: "飛行機" },
	],
};

// モックAPIのハンドラーを設定
export const handlers = [
	// 大分類を取得するAPI
	http.get("/api/category", (req, res, ctx) => {
		return res(
			ctx.status(200),
			ctx.json(categories), // 大分類のリストを返す
		);
	}),

	// 小分類を取得するAPI
	http.get("/api/category/:root_category_id", (req, res, ctx) => {
		const { root_category_id } = req.params;
		const subCategoryData =
			subCategories[root_category_id as keyof typeof subCategories];

		if (subCategoryData) {
			return res(
				ctx.status(200),
				ctx.json(subCategoryData), // 小分類のリストを返す
			);
		}

		return res(
			ctx.status(404),
			ctx.json({ message: "小分類が見つかりませんでした" }),
		);
	}),
];
