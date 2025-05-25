// redux/cartActions.js
import { createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "../axios/axios";

export const fetchCart = createAsyncThunk("cart/fetchCart", async (_, thunkAPI) => {
  try {
    const res = await api.get("/carts");
    return res.data.cart;
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response.data);
  }
});

export const addCartItem = createAsyncThunk("cart/addCartItem", async ({ product, quantity }, thunkAPI) => {
  try {
    await api.post("/carts", {
      productId: product._id,
      quantity: quantity, 
      priceAtAddition: product.finalPrice,
    });
    thunkAPI.dispatch(fetchCart()); 
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response.data);
  }
});

export const removeCartItem = createAsyncThunk("cart/removeCartItem", async (itemId, thunkAPI) => {
  try {
    await api.delete(`/carts/${itemId}`);
    thunkAPI.dispatch(fetchCart());
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response.data);
  }
});

export const updateCartQuantity = createAsyncThunk(
  "cart/updateCartQuantity",
  async ({ itemId, type, currentQuantity }, thunkAPI) => {
    const newQuantity = type === "inc" ? currentQuantity + 1 : currentQuantity - 1;
    if (newQuantity < 1) return;

    try {
      await api.patch(`/carts/${itemId}`, {
        quantity: newQuantity,
      });
      thunkAPI.dispatch(fetchCart());
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response.data);
    }
  }
);

export const clearCartItems = createAsyncThunk(
  "cart/clearCart",
  async (_, thunkAPI) => {
    try {
      await api.delete("/carts/clear");
      thunkAPI.dispatch(fetchCart());
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data || err.message);
    }
  }
);

