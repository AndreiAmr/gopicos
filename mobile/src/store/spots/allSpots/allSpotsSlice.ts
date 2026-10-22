import { createAction, createSlice } from '@reduxjs/toolkit';
import { EAllSpotsCustomActionTypes, IAllSpotsState } from './allSpotsTypes';

export const AllSpotsSliceName = 'allSpots';

const initialState: IAllSpotsState = {
  data: null,
  isLoading: false,
  isError: false,
};

export const allSpotsSlice = createSlice({
  name: AllSpotsSliceName,
  initialState,
  reducers: {
    setIsLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    setIsError: (state, action) => {
      state.isError = action.payload;
    },
    setData: (state, action) => {
      state.data = action.payload;
    },
  },
  selectors: {
    getIsLoading: state => state.isLoading,
    getIsError: state => state.isError,
    getData: state => state.data || [],
    getSpotsAmount: state => state.data?.length || 0,
  },
});

const getAllSpotsAsync = createAction(
  EAllSpotsCustomActionTypes.GET_ALL_SPOTS_ASYNC,
);

export const allSpotsActions = {
  ...allSpotsSlice.actions,
  getAllSpotsAsync,
};

export const allSpotsSelectors = allSpotsSlice.selectors;
