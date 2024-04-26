"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const uuid_1 = require("uuid");
const dbController_1 = require("./src/dbController");
const db = Array.from({ length: 100 }).map((_, i) => ({
    id: (0, uuid_1.v4)(),
    imageUrl: `https://picsum.photos/id/${i}/200/200`,
    description: `임시상품내용${i}`,
    price: 1000 * Math.floor(Math.random() * 20) + 500,
    title: `임시상품${i}`,
    createdAt: 1642424841540 + 1000 * 60 * 60 * 5 * i,
}));
(0, dbController_1.writeDB)(dbController_1.DBField.PRODUCTS, db);
