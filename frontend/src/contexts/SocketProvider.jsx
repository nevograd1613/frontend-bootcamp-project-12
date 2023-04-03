import React, { useMemo } from 'react';
import { useDispatch } from 'react-redux';
// eslint-disable-next-line import/no-extraneous-dependencies
import filter from 'leo-profanity';
// eslint-disable-next-line import/no-extraneous-dependencies
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';
import { SocketContext } from './index.jsx';
import { actions as messagesActions } from '../slices/messagesSlice.js';
import { actions as channelsActions } from '../slices/chanelsSlice.js';

const SocketProvider = ({ children, socket }) => {
  const dispatch = useDispatch();
  filter.loadDictionary('ru');
  const { t } = useTranslation();

  socket.on('newMessage', (payload) => {
    dispatch(messagesActions.addMessage(payload));
  });

  socket.on('removeChannel', (payload) => {
    dispatch(channelsActions.removeChannel(payload.id));
  });

  socket.on('newChannel', (payload) => {
    dispatch(channelsActions.addChannel(payload));
  });

  socket.on('renameChannel', (payload) => {
    const { id, name } = payload;
    dispatch(channelsActions.updateChannel({ id, changes: { name } }));
  });

  const addMessage = (value, activeId, userName) => {
    socket.emit('newMessage', { body: filter.clean(value), channelId: activeId, username: userName }, (response) => {
      console.log(response);
      if (response.status !== 'ok') {
        throw new Error(response.status);
      }
    });
  };

  const deleteChannel = (target, setActiveId, initialId, setSubmitDisabled) => {
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
    socket.emit('removeChannel', { id: target.id }, (response) => {
      setActiveId(initialId);
      setSubmitDisabled(false);
      if (response.status === 'ok') {
        dispatch(channelsActions.removeChannel(target.id));
      }
    });
  };

  const addChannel = (values, setActiveId, setSubmitDisabled) => {
    socket.emit('newChannel', { name: values.name }, (response) => {
      setActiveId(response.data.id);
      setSubmitDisabled(false);
      if (response.status !== 'ok') {
        throw new Error(response.status);
      }
    });
  };

  const renameChannel = (target, values, setSubmitDisabled) => {
    socket.emit('renameChannel', { id: target.id, name: values.name }, (response) => {
      setSubmitDisabled(false);
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
