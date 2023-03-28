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

  const addMessage = (value, activeId, userName) => {
    socket.emit('newMessage', { body: filter.clean(value), channelId: activeId, username: userName }, (response) => {
      if (response.status === 'ok') {
        socket.on('newMessage', (payload) => {
          dispatch(messagesActions.addMessage(payload));
        });
      }
    });
  };

  const deleteChannel = (target, setActiveId, initialId, setSubmitDisabled) => {
    socket.emit('removeChannel', { id: target.id }, (response) => {
      if (response.status === 'ok') {
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
        socket.on('removeChannel', (payload) => {
          dispatch(channelsActions.removeChannel(payload.id));
          setActiveId(initialId);
          setSubmitDisabled(false);
        });
      }
    });
  };

  const addChannel = (values, setActiveId, setSubmitDisabled) => {
    socket.emit('newChannel', { name: values.name }, (response) => {
      if (response.status === 'ok') {
        socket.on('newChannel', (payload) => {
          setActiveId(payload.id);
          dispatch(channelsActions.addChannel(payload));
          setSubmitDisabled(false);
        });
      }
    });
  };

  const renameChannel = (target, values, setSubmitDisabled) => {
    socket.emit('renameChannel', { id: target.id, name: values.name }, (response) => {
      if (response.status === 'ok') {
        socket.on('renameChannel', (payload) => {
          const { id, name } = payload;
          dispatch(channelsActions.updateChannel({ id, changes: { name } }));
          setSubmitDisabled(false);
        });
      }
    });
  };

  const memo = useMemo(() => ({
    addMessage, deleteChannel, addChannel, renameChannel,
  }), [addMessage, deleteChannel, addChannel, renameChannel]);

  return (
    <SocketContext.Provider value={memo}>
      {children}
    </SocketContext.Provider>
  );
};

export default SocketProvider;
