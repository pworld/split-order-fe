export type Product = {
    name: string;
    id: number;
    price: number;
    weight: number;
  };
  
export type Package = {
  items: Product[];
  totalPrice: number;
  totalWeight: number;
  courierCharge: number;
};
  