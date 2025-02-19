import { useEffect, useState } from "react";
import {
  Container, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, 
  Paper, Checkbox, Button, TextField, Card, TablePagination, Snackbar, Alert,
  Box, Grid
} from "@mui/material";
import { Product, Package } from "../../model/types";
import { fetchProducts, addProduct, deleteProduct, placeOrder } from "../../services/products/api";
import { useOrderStore } from "../../services/products/useProductStore";

const ProductList = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [newProduct, setNewProduct] = useState({ name: "", price: "", weight: "" });
  const [packages, setPackages] = useState<Package[]>([]);
  const { selectedItems, addItem, removeItem, clearSelection } = useOrderStore();
  
  // Pagination state
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  
  // Snackbar state
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

  useEffect(() => {
    fetchProducts().then(setProducts);
  }, []);

  // Handle new product input
  const handleAddProduct = async () => {
    if (!newProduct.name || !newProduct.price || !newProduct.weight) return;
    await addProduct({ name: newProduct.name, price: Number(newProduct.price), weight: Number(newProduct.weight) });
    setNewProduct({ name: "", price: "", weight: "" });
    setProducts(await fetchProducts());
    setSnackbar({ open: true, message: "Product added successfully!", severity: "success" });
  };

  // Handle deleting a product
  const handleDeleteProduct = async (id: number) => {
    await deleteProduct(id);
    setProducts(await fetchProducts());
    setSnackbar({ open: true, message: "Product deleted successfully!", severity: "success" });
  };

  // Place order
  const handlePlaceOrder = async () => {
    const orderPackages = await placeOrder(selectedItems);
    setPackages(orderPackages);
    setSnackbar({ open: true, message: "Order placed successfully!", severity: "success" });
  };

  // Handle pagination changes
  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <Container>
      <Snackbar open={snackbar.open} autoHideDuration={3000} onClose={() => setSnackbar({ ...snackbar, open: false })}>
        <Alert onClose={() => setSnackbar({ ...snackbar, open: false })}>
          {snackbar.message}
        </Alert>
      </Snackbar>
      
      <Box mb={2}>
        <h2>Product List</h2>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={3}>
            <TextField fullWidth label="Name" value={newProduct.name} onChange={(e) => setNewProduct((prev) => ({ ...prev, name: e.target.value }))} />
          </Grid>
          <Grid item xs={12} sm={3}>
            <TextField fullWidth label="Price" type="number" value={newProduct.price} onChange={(e) => setNewProduct((prev) => ({ ...prev, price: e.target.value }))} />
          </Grid>
          <Grid item xs={12} sm={3}>
            <TextField fullWidth label="Weight" type="number" value={newProduct.weight} onChange={(e) => setNewProduct((prev) => ({ ...prev, weight: e.target.value }))} onKeyDown={(e) => e.key === "Enter" && handleAddProduct()} />
          </Grid>
          <Grid item xs={12} sm={3}>
            <Button variant="contained" onClick={handleAddProduct}>Add Product</Button>
          </Grid>
        </Grid>
      </Box>

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
            {products.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((product) => (
              <TableRow key={product.id}>
                <TableCell>
                  <Checkbox checked={selectedItems.includes(product.id)} onChange={(e) => e.target.checked ? addItem(product.id) : removeItem(product.id)} />
                </TableCell>
                <TableCell>{product.id}</TableCell>
                <TableCell>{product.name}</TableCell>
                <TableCell>${product.price}</TableCell>
                <TableCell>{product.weight}g</TableCell>
                <TableCell>
                  <Button variant="outlined" color="error" onClick={() => handleDeleteProduct(product.id)}>Delete</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={products.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </TableContainer>

      <Button variant="contained" color="secondary" onClick={() => { clearSelection(); setPackages([]); }} style={{ margin: "10px" }}>Remove All Selections</Button>
      <Button variant="contained" color="primary" onClick={handlePlaceOrder} disabled={selectedItems.length === 0}>Place Order</Button>

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
