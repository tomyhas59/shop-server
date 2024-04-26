"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.writeDB = exports.readDB = exports.DBField = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = require("path");
var DBField;
(function (DBField) {
    DBField["CART"] = "cart";
    DBField["PRODUCTS"] = "products";
})(DBField || (exports.DBField = DBField = {}));
//파일 경로를 정규화하고 절대 경로로 변환
const basePath = (0, path_1.resolve)();
const filenames = {
    [DBField.CART]: (0, path_1.resolve)(basePath, "src/db/cart.json"),
    [DBField.PRODUCTS]: (0, path_1.resolve)(basePath, "src/db/products.json"),
};
const readDB = (target) => {
    try {
        return JSON.parse(fs_1.default.readFileSync(filenames[target], "utf-8"));
    }
    catch (err) {
        console.error(err);
    }
};
exports.readDB = readDB;
const writeDB = (target, data) => {
    try {
        fs_1.default.writeFileSync(filenames[target], JSON.stringify(data, null, " "));
    }
    catch (err) {
        console.error(err);
    }
};
exports.writeDB = writeDB;
