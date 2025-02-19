import axios from "axios";
import { Package, Product } from "../../model/types";

const API_URL = import.meta.env.VITE_API_BASE_URL;

// Fetch all products
export const fetchProducts = async (): Promise<Product[]> => {
  const response = await axios.get(`${API_URL}/products`);
  return response.data;
};

// Add new product
export const addProduct = async (product: Omit<Product, "id">) => {
  await axios.post(`${API_URL}/products`, {item:product});
};

// Delete product by ID
export const deleteProduct = async (id: number) => {
  await axios.delete(`${API_URL}/products/${id}`);
};

// Place order and get package breakdown
export const placeOrder = async (selected_items_ids: number[]): Promise<Package[]> => {
  const response = await axios.post(`${API_URL}/count-charges`, { selected_items_ids });
  return response.data;
};
