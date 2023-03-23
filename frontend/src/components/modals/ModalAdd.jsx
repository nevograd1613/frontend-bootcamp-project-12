import React from 'react';
import ModalForm from './ModalForm';

const Add = ({ close, setActiveId }) => {
  const title = 'Добавить канал';
  const added = true;
  return (
    <ModalForm close={close} title={title} setActiveId={setActiveId} added={added} />
  );
};

export default Add;
