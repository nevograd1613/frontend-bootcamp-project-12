import React from 'react';
import { useTranslation } from 'react-i18next';
import ModalForm from './ModalForm';

const Add = ({ close, setActiveId }) => {
  const { t } = useTranslation();
  const title = t('modal.add');
  const added = true;
  return (
    <ModalForm close={close} title={title} setActiveId={setActiveId} added={added} />
  );
};

export default Add;
