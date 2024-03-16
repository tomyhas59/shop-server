const mockProducts = (() =>
  Array.from({ length: 20 }).map((_, i) => ({
    id: i + 1 + "",
    imageUrl: `https://picsum.photos/id/${i + 10}/200/200`,
    price: 50000,
    title: `임시상품${i + 1}`,
    description: `임시상품내용${i + 1}`,
    createAt: new Date(1646735500542 + i * 1000 * 60 * 60 * 10).toString(),
  })))();

let cartData = [{ id: "1", amount: 1 }];

const cartResolver = {
  Query: {
    cart: (parent, args, context, info) => {
      return cartData;
    },
  },

  Mutation: {
    addCart: (parent, { id }, context, info) => {
      const newData = { ...cartData };
      const product = mockProducts.find((product) => product.id === id);
      if (!product) {
        throw new Error("상품이 없습니다");
      }
      const newItem = {
        ...product,
        amount: (newData[id]?.amount || 0) + 1,
      };
      newData[id] = newItem;
      cartData = newData;

      return newItem;
    },

    updateCart: (parent, { id, amount }, context, info) => {
      const newData = { ...cartData };
      if (!newData[id]) {
        throw new Error("없는 데이터입니다");
      }
      const newItem = {
        ...newData[id],
        amount,
      };
      newData[id] = newItem;
      cartData = newData;
      return newItem;
    },
    deleteCart: (parent, { id }, context, info) => {
      const newData = { ...cartData };
      delete newData[id];
      cartData = newData;
      return id;
    },
    executePay: (parent, { ids }, context, info) => {
      const newCartData = cartData.filter(
        (cartItem) => !ids.includes(cartItem.id)
      );
      cartData = newCartData;
      return ids;
    },
  },
};

export default cartResolver;
