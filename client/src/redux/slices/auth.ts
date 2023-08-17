import { createSlice } from "@reduxjs/toolkit";

interface TState {
  notSignedInPopupOpen: boolean;
}

const initialState: TState = {
  notSignedInPopupOpen: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    toggleNotSignedInPopupOpen: (state) => {
      state.notSignedInPopupOpen = !state.notSignedInPopupOpen;
    },
    showNotSignedInPopup: (state) => {
      state.notSignedInPopupOpen = true;
    },
    hideNotSignedInPopup: (state) => {
      state.notSignedInPopupOpen = false;
    },
  },
});

export const {
  hideNotSignedInPopup,
  showNotSignedInPopup,
  toggleNotSignedInPopupOpen,
} = authSlice.actions;
const { reducer: counterReducer } = authSlice;
export default counterReducer;
