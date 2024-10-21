"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const apollo_server_express_1 = require("apollo-server-express");
const product_1 = __importDefault(require("./product"));
const cart_1 = __importDefault(require("./cart"));
const signUp_1 = __importDefault(require("./signUp"));
const review_1 = __importDefault(require("./review"));
const linkSchema = (0, apollo_server_express_1.gql) `
  type Query {
    _: Boolean #임시 쿼리
  }
  type Mutation {
    _: Boolean
  }
`;
exports.default = [
    linkSchema,
    product_1.default,
    cart_1.default,
    signUp_1.default,
    review_1.default,
];
