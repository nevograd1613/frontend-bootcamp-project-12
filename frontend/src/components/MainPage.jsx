import axios from 'axios';
import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import {
  Container,
  Row,
} from 'react-bootstrap';
import routes from '../routes.js';
import Modals from './modals/Modals.jsx';
import { actions as channelsActions } from '../slices/chanelsSlice.js';
import { actions as messagesActions } from '../slices/messagesSlice.js';
import useAuth from '../hooks/index.jsx';
import MainPageChannels from './MainPageChannels.jsx';
import MainPageChat from './MainPageChat.jsx';

const MainPage = () => {
  const auth = useAuth();
  const dispatch = useDispatch();
  useEffect(() => {
    const fetchContent = async () => {
      try {
        const { data } = await axios.get(routes.usersPath(), { headers: auth.getAuthHeader() });
        dispatch(channelsActions.addChannels(data.channels));
        dispatch(messagesActions.addMessages(data.messages));
        dispatch(channelsActions.activeChannelId(data.currentChannelId));
        dispatch(channelsActions.initiallId(data.currentChannelId));
      } catch (e) {
        console.log(e);
        if (e.response.status === 401) {
          auth.logOut();
        }
      }
    };
    fetchContent();
  }, [dispatch]);

  return (
    <Container className="h-100 my-4 overflow-hidden rounded shadow">
      <Modals />
      <Row className="h-100 bg-white flex-md-row">
        <MainPageChannels />
        <MainPageChat />
      </Row>
    </Container>
  );
};

export default MainPage;
