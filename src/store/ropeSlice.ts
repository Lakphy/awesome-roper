import { createSlice } from "@reduxjs/toolkit";
import { AppState } from "./store";
import { HYDRATE } from "next-redux-wrapper";

export enum RopeFlow {
  NONE,
  PENDING,
  FINISHED,
}

// Type for our state
export interface ropeState {
  ropeState: RopeFlow;
}

// Initial state
const initialState: ropeState = {
  ropeState: RopeFlow.NONE,
};

// Actual Slice
export const ropeSlice = createSlice({
  name: "rope",
  initialState,
  reducers: {
    // Action to set the authentication status
    setRopeState(state, action) {
      state.ropeState = action.payload;
    },
  },

  // Special reducer for hydrating the state. Special case for next-redux-wrapper
  extraReducers: {
    [HYDRATE]: (state, action) => {
      return {
        ...state,
        ...action.payload.auth,
      };
    },
  },
});

export const { setRopeState } = ropeSlice.actions;

export const selectRopeState = (state: AppState) => state.rope.ropeState;

export default ropeSlice.reducer;
