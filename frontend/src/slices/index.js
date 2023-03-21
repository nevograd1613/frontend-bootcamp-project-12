import { configureStore } from '@reduxjs/toolkit';
import channelsSlice from './chanelsSlice.js';
import messagesSlice from './messagesSlice.js';

export default configureStore({
  reducer: {
    channels: channelsSlice,
    messages: messagesSlice,
  },
});
