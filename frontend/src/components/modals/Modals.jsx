import React from 'react';
import { Modal } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { actions as modalsActions, getModalState } from '../../slices/modalsSlice.js';
import Add from './ModalAdd.jsx';
import Rename from './ModalRename.jsx';
import Remove from './ModalDelete.jsx';

const modalComponents = {
  adding: Add,
  renaming: Rename,
  removing: Remove,
};

const Modals = () => {
  const dispatch = useDispatch();
  const { isOpened, type, channelId } = useSelector(getModalState);
  const ModalComponent = modalComponents[type];
  const close = () => dispatch(modalsActions.closeModal());
  return (
    <Modal
      show={isOpened}
      onHide={close}
      centered
    >
      {isOpened && (
      <ModalComponent
        channelId={channelId}
        close={close}
      />
      )}
    </Modal>
  );
};

export default Modals;
