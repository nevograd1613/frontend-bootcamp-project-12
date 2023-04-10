import React, { useRef, useEffect } from 'react';
import { Modal, Form, Button } from 'react-bootstrap';
import { useFormik } from 'formik';
import { useSelector } from 'react-redux';
import * as Yup from 'yup';
import { useTranslation } from 'react-i18next';
// eslint-disable-next-line import/no-extraneous-dependencies
import { toast } from 'react-toastify';
import { selectors as channelsSelectors } from '../../slices/chanelsSlice.js';
import useSocket from '../../hooks/socketContext.jsx';

const Add = ({ close }) => {
  const { t } = useTranslation();
  const chatApi = useSocket();
  const input = useRef();
  const { channels } = useSelector((state) => {
    const allChannels = channelsSelectors.selectAll(state);
    return { channels: allChannels };
  });
  const channelNames = channels.map((el) => el.name);
  const channelSchema = Yup.object().shape({
    name: Yup.string()
      .min(3, t('modal.lengthParams'))
      .max(20, t('modal.lengthParams'))
      .required()
      .notOneOf(
        channelNames,
        t('modal.unique'),
      ),
  });
  const formik = useFormik({
    initialValues: { name: '' },
    validationSchema: channelSchema,
    onSubmit: async (values) => {
      toast.success(t('success.newChannel'), {
        position: 'top-right',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'light',
      });
      chatApi.addChannel(values);
      close();
    },
  });
  useEffect(() => {
    input.current.select();
  }, [formik.touched.name]);
  return (
    <>
      <Modal.Header closeButton>
        <Modal.Title>
          {t('modal.add')}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={formik.handleSubmit}>
          <Form.Floating>
            <Form.Control
              id="name"
              name="name"
              autoFocus
              autoComplete="false"
              onChange={formik.handleChange}
              value={formik.values.name}
              isInvalid={!!formik.errors.name}
              onBlur={formik.handleBlur}
              ref={input}
              type="text"
            />
            <Form.Label htmlFor="name" className="visually-hidden">
              {t('modal.canalName')}
            </Form.Label>
            <Form.Control.Feedback type="invalid">
              {formik.errors.name}
            </Form.Control.Feedback>
            <div className="mt-3 d-flex justify-content-end">
              <Button className="me-2" variant="secondary" onClick={close}>
                {t('cancel')}
              </Button>
              <Button variant="primary" type="submit" disabled={!!formik.errors.name}>
                {t('send')}
              </Button>
            </div>
          </Form.Floating>
        </Form>
      </Modal.Body>
    </>
  );
};

export default Add;
