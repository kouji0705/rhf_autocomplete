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

app.get("/api/category", (req, res) => {
	res.json(categories);
});

app.get("/api/category/:id", (req, res) => {
	const subCategory = subCategories[req.params.id];
	if (subCategory) {
		res.json(subCategory);
	} else {
		res.status(404).send("Not found");
	}
});

app.listen(port, () => {
	console.log(`Mock API server running at http://localhost:${port}`);
});
