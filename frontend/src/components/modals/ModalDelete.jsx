import React, { useState } from 'react';
import { Modal, Button } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import useSocket from '../../hooks/socketContext.jsx';

const Remove = ({
  close, target, setActiveId, initialId,
}) => {
  const { t } = useTranslation();
  const sockets = useSocket();
  const [submitDisabled, setSubmitDisabled] = useState(false);

  const remove = () => {
    setSubmitDisabled(true);
    sockets.deleteChannel(target, setActiveId, initialId, setSubmitDisabled);
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
