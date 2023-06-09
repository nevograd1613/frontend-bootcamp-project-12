import { configureStore } from '@reduxjs/toolkit';
import channelsSlice from './chanelsSlice.js';
import messagesSlice from './messagesSlice.js';
import modalsSlice from './modalsSlice.js';

export default configureStore({
  reducer: {
    channels: channelsSlice,
    messages: messagesSlice,
    modals: modalsSlice,
  },
});
