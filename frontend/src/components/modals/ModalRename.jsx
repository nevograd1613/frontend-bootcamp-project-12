import React from 'react';
import { useTranslation } from 'react-i18next';
import ModalForm from './ModalForm';

const Rename = ({ close, target }) => {
  const { t } = useTranslation();
  const title = t('modal.renameChannel');
  const added = false;
  return (
    <ModalForm close={close} title={title} added={added} target={target} />
  );
};

export default Rename;
