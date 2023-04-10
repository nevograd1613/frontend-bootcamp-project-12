import React, { useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
// eslint-disable-next-line import/no-extraneous-dependencies
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';
import { SocketContext } from './index.jsx';
import { actions as messagesActions } from '../slices/messagesSlice.js';
import { actions as channelsActions } from '../slices/chanelsSlice.js';

const SocketProvider = ({ children, chatApi }) => {
  const dispatch = useDispatch();
  const { t } = useTranslation();

  chatApi.on('newMessage', (payload) => {
    dispatch(messagesActions.addMessage(payload));
  });

  chatApi.on('removeChannel', (payload) => {
    dispatch(channelsActions.removeChannel(payload.id));
  });

  chatApi.on('newChannel', (payload) => {
    dispatch(channelsActions.addChannel(payload));
  });

  chatApi.on('renameChannel', (payload) => {
    const { id, name } = payload;
    dispatch(channelsActions.updateChannel({ id, changes: { name } }));
  });

  const activeChannelId = useSelector((state) => {
    const { currentChannelId } = state.channels;
    return currentChannelId;
  });

  const initialId = useSelector((state) => {
    const { initialChannelId } = state.channels;
    return initialChannelId;
  });

  const setActiveChannelId = (id) => {
    dispatch(channelsActions.activeChannelId(id));
  };

  const addMessage = (value, userName) => {
    chatApi.emit('newMessage', { body: value, channelId: activeChannelId, username: userName }, (response) => {
      if (response.status !== 'ok') {
        throw new Error(response.status);
      }
    });
  };

  const deleteChannel = (target) => {
    toast.success(t('success.removeChannel'), {
      position: 'top-right',
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: 'light',
    });
    chatApi.emit('removeChannel', { id: target.id }, (response) => {
      setActiveChannelId(initialId);
      if (response.status === 'ok') {
        dispatch(channelsActions.removeChannel(target.id));
      }
    });
  };

  const addChannel = (values) => {
    chatApi.emit('newChannel', { name: values.name }, (response) => {
      setActiveChannelId(response.data.id);
      if (response.status !== 'ok') {
        throw new Error(response.status);
      }
    });
  };

  const renameChannel = (target, values) => {
    chatApi.emit('renameChannel', { id: target.id, name: values.name }, (response) => {
      if (response.status === 'ok') {
        dispatch(channelsActions.updateChannel({ id: target.id, changes: { name: values.name } }));
      }
    });
  };

  const memo = useMemo(() => ({
    addMessage, deleteChannel, addChannel, renameChannel,
  }));

  return (
    <SocketContext.Provider value={memo}>
      {children}
    </SocketContext.Provider>
  );
};

export default SocketProvider;
