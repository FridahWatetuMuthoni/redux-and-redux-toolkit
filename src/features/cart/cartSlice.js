import { createSlice } from "@reduxjs/toolkit";
import cartItems from "../../cartItems";

const initialState = {
  cartItems: cartItems,
  amount: 0, //number of items
  total: 0, //total amount
  isLoading: true,
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
});

console.log(cartSlice);

export default cartSlice.reducer;
