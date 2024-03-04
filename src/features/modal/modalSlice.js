import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isOpen: false,
};

const modalSlice = createSlice({
  name: "model",
  initialState,
  reducers: {
    openModal: (state, action) => {
      console.log(action);
      state.isOpen = true;
    },
    closeModal: (state, action) => {
      console.log(action);
      state.isOpen = false;
    },
  },
});

export default modalSlice.reducer;
export const { openModal, closeModal } = modalSlice.actions;
