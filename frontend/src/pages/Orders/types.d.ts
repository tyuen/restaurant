export type TOrder = {
  id: number;
  customerId?: number;
  merchantId?: number;
  createdAt: string;
  merchant?: {
    id: number;
    name: string;
    address: string;
    typeId?: number;
    type: {
      id: number;
      type: string;
    };
  };
  items?: {
    id: number;
    orderId: number;
    productId?: number;
    price: number;
    quantity: number;
    product: {
      id: number;
      merchantId?: number;
      name: string;
      price: number;
    };
  }[];
};
