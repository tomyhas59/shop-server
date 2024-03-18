import { Resolvers } from "./types";

const productResolver: Resolvers = {
  Query: {
    products: (parent, args, context) => {
      return context.db.products;
    },
    product: (parent, { id }, { db }) => {
      const found = db.products.find((item) => item.id === id);
      if (found) return found;
      return null;
    },
  },
};

export default productResolver;
