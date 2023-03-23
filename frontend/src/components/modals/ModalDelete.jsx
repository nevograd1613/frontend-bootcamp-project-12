import React, { useState } from 'react';
import { Modal, Button } from 'react-bootstrap';
import { io } from 'socket.io-client';
import { useDispatch } from 'react-redux';
import { actions as channelsActions } from '../../slices/chanelsSlice.js';

const socket = io();

const Remove = ({
  close, target, setActiveId, initialId,
}) => {
  console.log(initialId);
  const dispatch = useDispatch();
  const [submitDisabled, setSubmitDisabled] = useState(false);

  const remove = () => {
    setSubmitDisabled(true);
    socket.emit('removeChannel', { id: target.id }, (response) => {
      if (response.status === 'ok') {
        socket.on('removeChannel', (payload) => {
          dispatch(channelsActions.removeChannel(payload.id));
          setActiveId(initialId);
          setSubmitDisabled(false);
        });
      }
    });
    close();
  };

  return (
    <>
      <Modal.Header closeButton>
        <Modal.Title>Удалить канал</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>Уверены?</p>
        <div className="mt-3 d-flex justify-content-end">
          <Button className="me-2" variant="secondary" onClick={close}>
            Отменить
          </Button>
          <Button variant="danger" type="button" onClick={remove} disabled={submitDisabled}>
            Удалить
          </Button>
        </div>
      </Modal.Body>
    </>
  );
};

export default Remove;
