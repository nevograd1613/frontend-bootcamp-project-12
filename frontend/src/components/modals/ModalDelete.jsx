import React, { useState } from 'react';
import { Modal, Button } from 'react-bootstrap';
import { io } from 'socket.io-client';
import { useDispatch } from 'react-redux';
// eslint-disable-next-line import/no-extraneous-dependencies
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';
import { actions as channelsActions } from '../../slices/chanelsSlice.js';

const socket = io();

const Remove = ({
  close, target, setActiveId, initialId,
}) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [submitDisabled, setSubmitDisabled] = useState(false);

  const remove = () => {
    setSubmitDisabled(true);
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
    close();
  };

  return (
    <>
      <Modal.Header closeButton>
        <Modal.Title>{t('modal.removeChannel')}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>{t('modal.confirm')}</p>
        <div className="mt-3 d-flex justify-content-end">
          <Button className="me-2" variant="secondary" onClick={close}>
            {t('cancel')}
          </Button>
          <Button variant="danger" type="button" onClick={remove} disabled={submitDisabled}>
            {t('modal.remove')}
          </Button>
        </div>
      </Modal.Body>
    </>
  );
};

export default Remove;
