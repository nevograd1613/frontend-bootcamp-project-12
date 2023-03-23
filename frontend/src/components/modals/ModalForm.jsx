import React, { useState, useRef, useEffect } from 'react';
import { Modal, Form, Button } from 'react-bootstrap';
import { useFormik } from 'formik';
import { useSelector, useDispatch } from 'react-redux';
import * as Yup from 'yup';
import { io } from 'socket.io-client';
import { actions as channelsActions, selectors as channelsSelectors } from '../../slices/chanelsSlice.js';

const socket = io();

const ModalForm = ({
  close, title, setActiveId, added, target,
}) => {
  const dispatch = useDispatch();
  const [sumbitDisabled, setSubmitDisabled] = useState(false);
  const input = useRef();
  const { channels } = useSelector((state) => {
    const allChannels = channelsSelectors.selectAll(state);
    return { channels: allChannels };
  });
  const channelNames = channels.map((el) => el.name);
  const channelSchema = Yup.object().shape({
    name: Yup.string()
      .min(3, 'modal.channelMinMax')
      .max(20, 'modal.channelMinMax')
      .required('modal.required')
      .notOneOf(
        channelNames,
        'modal.channelAlreadyExtists',
      ),
  });
  const formik = useFormik({
    initialValues: { name: added ? '' : target.name },
    validationSchema: channelSchema,
    onSubmit: async (values) => {
      setSubmitDisabled(true);
      if (added) {
        socket.emit('newChannel', { name: values.name }, (response) => {
          if (response.status === 'ok') {
            socket.on('newChannel', (payload) => {
              setActiveId(payload.id);
              dispatch(channelsActions.addChannel(payload));
              setSubmitDisabled(false);
            });
          }
        });
      } else {
        socket.emit('renameChannel', { id: target.id, name: values.name }, (response) => {
          if (response.status === 'ok') {
            socket.on('renameChannel', (payload) => {
              const { id, name } = payload;
              dispatch(channelsActions.updateChannel({ id, changes: { name } }));
              setSubmitDisabled(false);
            });
          }
        });
      }
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
          {title}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={formik.handleSubmit}>
          <Form.Group>
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
            />
            <Form.Label htmlFor="name" className="visually-hidden">
              Имя канала
            </Form.Label>
            <Form.Control.Feedback type="invalid">
              {formik.errors.name}
            </Form.Control.Feedback>
            <div className="mt-3 d-flex justify-content-end">
              <Button className="me-2" variant="secondary" onClick={close}>
                Отменить
              </Button>
              <Button variant="primary" type="submit" disabled={!!formik.errors.name || sumbitDisabled}>
                Отправить
              </Button>
            </div>
          </Form.Group>
        </Form>
      </Modal.Body>
    </>
  );
};

export default ModalForm;