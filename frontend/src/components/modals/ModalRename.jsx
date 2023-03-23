import React from 'react';
import ModalForm from './ModalForm';

const Rename = ({ close, target }) => {
  const title = 'Переименовать канал';
  const added = false;
  return (
    <ModalForm close={close} title={title} added={added} target={target} />
  );
};

export default Rename;
