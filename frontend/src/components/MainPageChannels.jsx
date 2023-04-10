import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Col,
  Nav,
  Dropdown,
  ButtonGroup,
  Button,
} from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
// eslint-disable-next-line import/no-extraneous-dependencies
import { PlusSquare } from 'react-bootstrap-icons';
import { actions as channelsActions, selectors as channelsSelectors } from '../slices/chanelsSlice.js';
import { actions as modalsActions } from '../slices/modalsSlice.js';

const MainPageChannels = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const activeChannelId = useSelector((state) => {
    const { currentChannelId } = state.channels;
    return currentChannelId;
  });
  const { channels } = useSelector((state) => {
    const allChannels = channelsSelectors.selectAll(state);
    return { channels: allChannels };
  });
  const setActiveChannelId = (id) => {
    dispatch(channelsActions.activeChannelId(id));
  };
  const addChannel = () => dispatch(modalsActions.openModal({ type: 'adding' }));
  const renameChannel = ({ id, name }) => () => dispatch(modalsActions.openModal({ type: 'renaming', target: { id, name } }));
  const removeChannel = ({ id }) => () => dispatch(modalsActions.openModal({ type: 'removing', target: { id } }));

  return (
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
                  variant={el.id === activeChannelId ? 'secondary' : ''}
                  onClick={() => {
                    setActiveChannelId(el.id);
                  }}
                >
                  <span className="p-1">#</span>
                  &nbsp;
                  {el.name}
                </Button>
                <Dropdown.Toggle
                  split
                  variant={el.id === activeChannelId ? 'secondary' : ''}
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
                  variant={el.id === activeChannelId ? 'secondary' : ''}
                  className="border-0 w-100 rounded-0 text-start"
                  onClick={() => {
                    setActiveChannelId(el.id);
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
  );
};

export default MainPageChannels;
