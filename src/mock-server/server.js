import express from "express";
import cors from "cors";
const app = express();
app.use(cors());
const port = 3000;

const categories = [
	{ id: 1, key: "food", name: "食べ物" },
	{ id: 2, key: "animal", name: "動物" },
	{ id: 3, key: "vehicle", name: "乗り物" },
];

const subCategories = {
	1: [
		{ id: 1, key: "apple", name: "りんご" },
		{ id: 2, key: "banana", name: "バナナ" },
		{ id: 3, key: "orange", name: "オレンジ" },
	],
	2: [
		{ id: 1, key: "dog", name: "犬" },
		{ id: 2, key: "cat", name: "猫" },
		{ id: 3, key: "rabbit", name: "うさぎ" },
	],
	3: [
		{ id: 1, key: "car", name: "車" },
		{ id: 2, key: "bike", name: "自転車" },
		{ id: 3, key: "bus", name: "バス" },
	],
};

// 大分類を検索するAPI
app.get("/api/category", (req, res) => {
	const searchName = req.query.searchName || ""; // クエリパラメータを取得
	const filteredCategories = categories.filter(
		(category) => category.name.includes(searchName), // 名前にsearchNameが含まれるかでフィルタリング
	);
	res.json(filteredCategories);
});
app.get("/api/category/:id", (req, res) => {
	const searchName = req.query.searchName || ""; // クエリパラメータを取得
	const subCategory = subCategories[req.params.id];

	if (subCategory) {
		const filteredSubCategories = subCategory.filter(
			(item) => item.name.includes(searchName), // 名前にsearchNameが含まれるかでフィルタリング
		);
		res.json(filteredSubCategories);
	} else {
		res.status(404).send("Not found");
	}
});

// サンプルデータ
const products = [
	{
		id: 1,
		category: { id: 1, key: "food", name: "食べ物" },
		subCategory: { id: 1, key: "apple", name: "りんご" },
	},
	{
		id: 2,
		category: { id: 2, key: "animal", name: "動物" },
		subCategory: { id: 1, key: "dog", name: "犬" },
	},
];

app.get("/api/product/:id", (req, res) => {
	const productId = Number.parseInt(req.params.id, 10);
	const product = products.find((p) => p.id === productId);

	if (product) {
		res.json(product);
	} else {
		res.status(404).send("Product not found");
	}
});

app.listen(port, () => {
	console.log(`Mock API server running at http://localhost:${port}`);
});
