import { Resolvers } from "./types";

const productResolver: Resolvers = {
  Query: {
    products: (parent, /**args */ { cursor = "" }, context) => {
      const fromIndex =
        context.db.products.findIndex((product) => product.id === cursor) + 1;
      return context.db.products.slice(fromIndex, fromIndex + 15) || [];
    },
    product: (parent, { id }, { db }) => {
      const found = db.products.find((item) => item.id === id);
      if (found) return found;
      return null;
    },
  },
};

export default productResolver;
