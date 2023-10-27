import { createSlice } from '@reduxjs/toolkit';
import { AppState } from './store';
import { HYDRATE } from 'next-redux-wrapper';

export enum RopeFlow {
  NONE,
  PENDING,
  FINISHED
}

// Type for our state
export interface ropeState {
  ropeState: RopeFlow;
  beginTime: number;
  jumps: number;
  totalTime: number;
}

// Initial state
const initialState: ropeState = {
  ropeState: RopeFlow.NONE,
  beginTime: 0,
  jumps: 0,
  totalTime: 0
};

// Actual Slice
export const ropeSlice = createSlice({
  name: 'rope',
  initialState,
  reducers: {
    setRopeState(state, action) {
      state.ropeState = action.payload;
    },
    setBeginTime(state, action) {
      state.beginTime = action.payload;
    },
    resetBeginTime(state) {
      state.beginTime = 0;
    },
    setJumps(state, action) {
      state.jumps = action.payload;
    },
    incrementJumps(state) {
      state.jumps++;
    },
    resetJumps(state) {
      state.jumps = 0;
    },
    setTotalTime(state, action) {
      state.totalTime = action.payload;
    },
    calculateTotalTime(state, action) {
      if (state.beginTime === 0) return;
      state.totalTime = action.payload - state.beginTime;
    }
  },

  // Special reducer for hydrating the state. Special case for next-redux-wrapper
  extraReducers: {
    [HYDRATE]: (state, action) => {
      return {
        ...state,
        ...action.payload.auth
      };
    }
  }
});

export const {
  setRopeState,
  setBeginTime,
  resetBeginTime,
  setJumps,
  incrementJumps,
  resetJumps,
  setTotalTime,
  calculateTotalTime
} = ropeSlice.actions;

export const selectRopeState = (state: AppState) => state.rope.ropeState;

export default ropeSlice.reducer;
