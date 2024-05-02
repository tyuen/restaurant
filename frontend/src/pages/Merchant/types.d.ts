export type TProduct = {
  id: number;
  merchantId: number;
  name: string;
  price: number;
};

export type TMerchant = {
  id: number;
  name: string;
  address: string;
  typeId?: number;
  type: {
    id: number;
    type: string;
  };
};
