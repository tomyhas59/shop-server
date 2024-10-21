"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const product_1 = __importDefault(require("./product"));
const cart_1 = __importDefault(require("./cart"));
const signUp_1 = __importDefault(require("./signUp"));
const review_1 = __importDefault(require("./review"));
exports.default = [product_1.default, cart_1.default, signUp_1.default, review_1.default];
