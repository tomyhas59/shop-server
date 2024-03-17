export type Resolvers = {
  [k in string]: {
    [key: string]: (
      parent: any,
      args: { [key: string]: any },
      context: {},
      info: any
    ) => any;
  };
};
