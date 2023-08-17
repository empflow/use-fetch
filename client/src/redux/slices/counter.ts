import { createSlice } from "@reduxjs/toolkit";

interface TState {
  value: number;
  changeByAmount: number;
}

const initialState: TState = {
  value: 0,
  changeByAmount: 0,
};

const counterSlice = createSlice({
  name: "counter",
  initialState,
  reducers: {
    increment: (state) => {
      state.value += 1;
    },
    decrement: (state) => {
      state.value -= 1;
    },
    changeByAmount: (state) => {
      state.value += state.changeByAmount;
    },
    setChangeByAmount: (state, { payload }) => {
      state.changeByAmount = Number(payload);
    },
  },
});

export const { changeByAmount, setChangeByAmount, decrement, increment } =
  counterSlice.actions;
const { reducer: counterReducer } = counterSlice;
export default counterReducer;
