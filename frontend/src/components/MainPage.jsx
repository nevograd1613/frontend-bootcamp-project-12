import axios from 'axios';
import React, { useRef, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Container,
  Row,
  Col,
  Nav,
  Dropdown,
  ButtonGroup,
  Button,
} from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
// eslint-disable-next-line import/no-extraneous-dependencies
import { ArrowRightSquare, PlusSquare } from 'react-bootstrap-icons';
import routes from '../routes.js';
import Modals from './modals/Modals.jsx';
import { actions as channelsActions, selectors as channelsSelectors } from '../slices/chanelsSlice.js';
import { actions as messagesActions, selectors as messagesSelectors } from '../slices/messagesSlice.js';
import { actions as modalsActions } from '../slices/modalsSlice.js';
import useAuth from '../hooks/index.jsx';
import useSocket from '../hooks/socketContext.jsx';

const MainPage = () => {
  const auth = useAuth();
  const sockets = useSocket();
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [activeId, setActiveId] = useState(null);
  const [sendMessage, setSendMessage] = useState(false);
  const [value, setValue] = useState('');
  const [initialId, setInitialId] = useState('');
  const inpRef = useRef();
  useEffect(() => {
    inpRef.current.focus();
  }, []);
  useEffect(() => {
    inpRef.current.focus();
  }, [activeId]);
  useEffect(() => {
    const block = document.getElementById('messages-box');
    block.scrollTop = block.scrollHeight;
  });
  const { channels } = useSelector((state) => {
    const allChannels = channelsSelectors.selectAll(state);
    return { channels: allChannels };
  });
  const { messages } = useSelector((state) => {
    const activeMessages = messagesSelectors.selectAll(state)
      .filter(({ channelId }) => channelId === activeId);
    return { messages: activeMessages };
  });
  const { activeChannel } = useSelector((state) => {
    const activeCN = channelsSelectors.selectById(state, activeId);
    return { activeChannel: activeCN };
  });
  const addChannel = () => dispatch(modalsActions.openModal({ type: 'adding' }));
  const renameChannel = ({ id, name }) => () => dispatch(modalsActions.openModal({ type: 'renaming', target: { id, name } }));
  const removeChannel = ({ id }) => () => dispatch(modalsActions.openModal({ type: 'removing', target: { id } }));
  useEffect(() => {
    const fetchContent = async () => {
      try {
        const { data } = await axios.get(routes.usersPath(), { headers: auth.getAuthHeader() });
        dispatch(channelsActions.addChannels(data.channels));
        dispatch(messagesActions.addMessages(data.messages));
        setInitialId(data.currentChannelId);
      } catch (e) {
        console.log(e);
        if (e.response.status === 401) {
          auth.logOut();
        }
      }
    };
    fetchContent();
  }, [addChannel, renameChannel, removeChannel, channels, messages, activeChannel]);
  useEffect(() => {
    setActiveId(initialId);
  }, [initialId]);

  const addNewMessage = (e) => {
    e.preventDefault();
    if (value.length > 0) {
      setSendMessage(true);
      const userName = JSON.parse(localStorage.getItem('userId')).username;
      sockets.addMessage(value, activeId, userName);
    }
    setSendMessage(false);
    setValue('');
  };

  return (
    <Container className="h-100 my-4 overflow-hidden rounded shadow">
      <Modals setActiveId={setActiveId} initialId={initialId} />
      <Row className="h-100 bg-white flex-md-row">
        <Col className="col-4 col-md-2 border-end px-0 bg-light flex-column h-100 d-flex">
          <div className="d-flex mt-1 justify-content-between mb-2 ps-4 pe-2 p-4">
            <b>{t('channelsTitle')}</b>
            <Button
              variant=""
              className="p-0 text-primary btn-group-vertical"
              onClick={addChannel}
            >
              <PlusSquare
                className="bi-plus-square"
                size={20}
              />
              <span className="visually-hidden">+</span>
            </Button>
          </div>
          <ul id="channels-box" className="nav flex-column nav-pills nav-fill px-2 mb-3 overflow-auto h-100 d-block">
            {channels.map((el) => (
              <Nav.Item as="li" key={el.id} className="w-100">
                {el.removable ? (
                  <Dropdown as={ButtonGroup} className="d-flex">
                    <Button
                      type="button"
                      className="border-0 w-100 rounded-0 text-start text-truncate"
                      variant={el.id === activeId ? 'secondary' : ''}
                      onClick={() => {
                        setActiveId(el.id);
                      }}
                    >
                      <span className="p-1">#</span>
                      &nbsp;
                      {el.name}
                    </Button>
                    <Dropdown.Toggle
                      split
                      variant={el.id === activeId ? 'secondary' : ''}
                      id="dropdown-split-basic"
                    >
                      <span className="visually-hidden">{t('modal.toggle')}</span>
                    </Dropdown.Toggle>
                    <Dropdown.Menu>
                      <Dropdown.Item onClick={removeChannel(el)}>
                        {t('modal.remove')}
                      </Dropdown.Item>
                      <Dropdown.Item onClick={renameChannel(el)}>
                        {t('modal.rename')}
                      </Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>
                )
                  : (
                    <Button
                      type="button"
                      variant={el.id === activeId ? 'secondary' : ''}
                      className="border-0 w-100 rounded-0 text-start"
                      onClick={() => {
                        setActiveId(el.id);
                      }}
                      key={el.id}
                    >
                      <span className="p-1">#</span>
                      &nbsp;
                      {el.name}
                    </Button>
                  )}
              </Nav.Item>
            ))}
          </ul>
        </Col>
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
      </Row>
    </Container>
  );
};

export default MainPage;
