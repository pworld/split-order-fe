import { useEffect, useState } from "react";

import {
  Container, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, 
  Paper, Checkbox, Button, TextField, Card
} from "@mui/material";
import { Product, Package } from "../../model/types";
import { fetchProducts, addProduct, deleteProduct, placeOrder } from "../../services/products/api";
import { useOrderStore } from "../../services/products/useProductStore";

const ProductList = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [newProduct, setNewProduct] = useState({ name: "" , price: "", weight: "" });
  const [packages, setPackages] = useState<Package[]>([]);
  const { selectedItems, addItem, removeItem, clearSelection } = useOrderStore();

  useEffect(() => {
    fetchProducts().then(setProducts);
  }, []);

  // Handle new product input
  const handleAddProduct = async () => {
    if (!newProduct.name || !newProduct.price || !newProduct.weight) return;
    await addProduct({ name: newProduct.name, price: Number(newProduct.price), weight: Number(newProduct.weight) });
    setNewProduct({ name: "",price: "", weight: "" });
    setProducts(await fetchProducts());
  };

  // Handle deleting a product
  const handleDeleteProduct = async (id: number) => {
    await deleteProduct(id);
    setProducts(await fetchProducts());
  };

  // Place order
  const handlePlaceOrder = async () => {
    const orderPackages = await placeOrder(selectedItems);
    setPackages(orderPackages);
  };

  return (
    <Container>
      <h2>Product List</h2>

      {/* Add Product */}
      <TextField
        label="Name"
        value={newProduct.name}
        onChange={(e) => setNewProduct((prev) => ({ ...prev, name: e.target.value }))}
        type="string"
      />
      <TextField
        label="Price"
        value={newProduct.price}
        onChange={(e) => setNewProduct((prev) => ({ ...prev, price: e.target.value }))}
        type="number"
      />
      <TextField
        label="Weight"
        value={newProduct.weight}
        onChange={(e) => setNewProduct((prev) => ({ ...prev, weight: e.target.value }))}
        type="number"
        onKeyDown={(e) => e.key === "Enter" && handleAddProduct()}
      />
      <Button variant="contained" onClick={handleAddProduct}>Add Product</Button>

      {/* Product Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Select</TableCell>
              <TableCell>ID</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Price ($)</TableCell>
              <TableCell>Weight (g)</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {products.map((product) => (
              <TableRow key={product.id}>
                <TableCell>
                  <Checkbox
                    checked={selectedItems.includes(product.id)}
                    onChange={(e) => e.target.checked ? addItem(product.id) : removeItem(product.id)}
                  />
                </TableCell>
                <TableCell>{product.id}</TableCell>
                <TableCell>{product.name}</TableCell>
                <TableCell>${product.price}</TableCell>
                <TableCell>{product.weight}g</TableCell>
                <TableCell>
                  <Button variant="outlined" color="error" onClick={() => handleDeleteProduct(product.id)}>
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Action Buttons */}
      <Button variant="contained" color="secondary" onClick={clearSelection} style={{ margin: "10px" }}>
        Remove All Selections
      </Button>
      
      <Button
        variant="contained"
        color="primary"
        onClick={handlePlaceOrder}
        disabled={selectedItems.length === 0}
      >
        Place Order
      </Button>

      {/* Display Packages */}
      <h2>Order Packages</h2>
      {packages.length > 0 &&
        packages.map((pkg, index) => (
          <Card key={index} style={{ padding: "10px", marginBottom: "16px" }}>
            <p><strong>Package {index + 1}</strong></p>
            <p><strong>Items:</strong> {pkg.items.map((item) => `Item ${item.id}`).join(", ")}</p>
            <p><strong>Total Price:</strong> ${pkg.totalPrice}</p>
            <p><strong>Total Weight:</strong> {pkg.totalWeight}g</p>
            <p><strong>Courier Charge:</strong> ${pkg.courierCharge}</p>
          </Card>
        ))}
    </Container>
  );
};

export default ProductList;
