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

const Modals = ({ setActiveId, initialId }) => {
  const dispatch = useDispatch();
  const { isOpened, type, target } = useSelector(getModalState);
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
        target={target}
        close={close}
        setActiveId={setActiveId}
        initialId={initialId}
      />
      )}
    </Modal>
  );
};

export default Modals;
