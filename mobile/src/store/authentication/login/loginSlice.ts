import { createAction, createSlice } from '@reduxjs/toolkit';

export const LoginSliceName = 'login';

const initialState = {
  isLoading: false,
  isError: false,
  data: null,
};

export const loginSlice = createSlice({
  name: LoginSliceName,
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
  },
});

const getLoginAsync = createAction('login/getLoginAsync');

export const loginActions = {
  ...loginSlice.actions,
  getLoginAsync,
};

export const loginSelectors = loginSlice.selectors;
