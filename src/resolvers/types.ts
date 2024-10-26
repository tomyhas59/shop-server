export type Resolvers = {
  [k: string]: {
    [key: string]: (
      parent: any,
      args: { [key: string]: any },
      context: {
        db: {
          cart: Cart;
          products: Products;
          reviews: Reviews;
        };
      },
      info: any
    ) => any;
  };
};

export type Product = {
  id: string;
  imageUrl: string;
  price: number;
  title: string;
  description: string;
  createdAt?: number;
};

export type Products = Product[];

export type CartItem = {
  id: string;
  amount: number;
  product: Product;
};

export type Cart = CartItem[];

export type User = {
  id: string;
  email: string;
  nickname: string;
};

export type Reviews = {
  id: string;
  productId: string;
  uid: string;
  content: string;
  rating: number;
  createdAt: string;
};
