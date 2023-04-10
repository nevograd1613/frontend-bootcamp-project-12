/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit';

const modalsSlice = createSlice({
  name: 'modals',
  initialState: {
    isOpened: false,
    type: null,
    channelId: null,
  },
  reducers: {
    openModal: ((state, { payload }) => {
      state.isOpened = true;
      state.type = payload.type;
      state.channelId = payload.target ?? null;
    }),
    closeModal: ((state) => {
      state.isOpened = false;
      state.type = null;
      state.channelId = null;
    }),
  },
});

export const getModalState = (state) => state.modals;
export const { actions } = modalsSlice;
export default modalsSlice.reducer;
