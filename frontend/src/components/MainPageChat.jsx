import React, { useRef, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import {
  Col,
  Button,
} from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
// eslint-disable-next-line import/no-extraneous-dependencies
import filter from 'leo-profanity';
// eslint-disable-next-line import/no-extraneous-dependencies
import { ArrowRightSquare } from 'react-bootstrap-icons';
import { selectors as channelsSelectors } from '../slices/chanelsSlice.js';
import { selectors as messagesSelectors } from '../slices/messagesSlice.js';
import useAuth from '../hooks/index.jsx';
import useSocket from '../hooks/socketContext.jsx';

const MainPageChat = () => {
  const auth = useAuth();
  const sockets = useSocket();
  const { t } = useTranslation();
  const [sendMessage, setSendMessage] = useState(false);
  const [value, setValue] = useState('');
  const inpRef = useRef();
  const activeChannelId = useSelector((state) => {
    const { currentChannelId } = state.channels;
    return currentChannelId;
  });
  useEffect(() => {
    inpRef.current.focus();
  }, []);
  useEffect(() => {
    inpRef.current.focus();
  }, [activeChannelId]);
  useEffect(() => {
    const block = document.getElementById('messages-box');
    block.scrollTop = block.scrollHeight;
  });
  const { messages } = useSelector((state) => {
    const activeMessages = messagesSelectors.selectAll(state)
      .filter(({ channelId }) => channelId === activeChannelId);
    return { messages: activeMessages };
  });
  const { activeChannel } = useSelector((state) => {
    const activeCN = channelsSelectors.selectById(state, activeChannelId);
    return { activeChannel: activeCN };
  });
  filter.loadDictionary('ru');

  const addNewMessage = async (e) => {
    try {
      e.preventDefault();
      if (value.length > 0) {
        setSendMessage(true);
        const userName = auth.userName();
        await sockets.addMessage(filter.clean(value), userName);
      }
      setSendMessage(false);
      setValue('');
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Col className="p-0 h-100">
      <div className="d-flex flex-column h-100">
        <div className="bg-light mb-4 p-3 shadow-sm small">
          <p className="m-0">
            <b>
              #&nbsp;
              {` ${activeChannel && activeChannel.name}`}
            </b>
          </p>
          <span className="text-muted">{t('messagesCounter.messages', { count: messages.length })}</span>
        </div>
        <div id="messages-box" className="chat-messages overflow-auto px-5 ">
          {messages && messages.map((el) => (
            <div className="text-break mb-2" key={el.id}>
              <b>{`${el.username}: `}</b>
              {el.body}
            </div>
          ))}
        </div>
        <div className="mt-auto px-5 py-3">
          <form noValidate="" className="py-1 border rounded-2" onSubmit={addNewMessage}>
            <div className="input-group has-validation">
              <input name="body" aria-label={t('newMessage')} placeholder={t('placeholders.newMessage')} className="border-0 p-0 ps-2 form-control" ref={inpRef} value={value} onChange={(e) => setValue(e.target.value)} />
              <Button type="submit" disabled={sendMessage} className="btn btn-group-vertical btn-light">
                <ArrowRightSquare
                  className="bi-plus-square"
                  size={20}
                />
                <span className="visually-hidden">{t('send')}</span>
              </Button>
            </div>
          </form>
        </div>
      </div>
    </Col>
  );
};

export default MainPageChat;
