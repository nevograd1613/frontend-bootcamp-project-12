import React, { useRef, useEffect, useState } from 'react';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button, Form } from 'react-bootstrap';
import axios from 'axios';
import useAuth from '../hooks/index.jsx';
import routes from '../routes.js';
import Entry from '../assets/signup.jpg';

const SignupSchema = Yup.object().shape({
  username: Yup.string()
    .trim()
    .min(3, 'Too Short!')
    .max(20, 'Too Long!')
    .required('Required'),
  password: Yup.string()
    .required('registration.required')
    .min(6, 'registration.passwordMin'),
  passwordConfirm: Yup.string()
    .oneOf([Yup.ref('password'), null], 'error')
    .required('registration.required'),
});

const Signup = () => {
  const auth = useAuth();
  const [authFailed, setAuthFailed] = useState(false);
  const inputRef = useRef();
  const location = useLocation();
  const navigate = useNavigate();
  useEffect(() => {
    inputRef.current.focus();
  }, []);
  const formik = useFormik({
    initialValues: {
      username: '',
      password: '',
      passwordConfirm: '',
    },
    SignupSchema,
    onSubmit: async (values) => {
      setAuthFailed(false);

      try {
        const res = await axios.post(routes.signUpPath(), values);
        localStorage.setItem('userId', JSON.stringify(res.data));
        auth.logIn();
        const { from } = location.state || { from: { pathname: '/' } };
        navigate(from);
      } catch (err) {
        formik.setSubmitting(false);
        if (err.isAxiosError && err.response.status === 409) {
          setAuthFailed(true);
          inputRef.current.select();
          return;
        }
        throw err;
      }
    },
  });
  return (
    <div className="container-fluid h-100">
      <div className="row justify-content-center align-content-center h-100">
        <div className="col-12 col-md-8 col-xxl-6">
          <div className="card shadow-sm">
            <div className="card-body row p-5">
              <div className="col-12 col-md-6 d-flex align-items-center justify-content-center">
                <img src={Entry} className="rounded-circle" alt="Войти" />
              </div>
              <Form onSubmit={formik.handleSubmit} className="col-12 col-md-6 mt-3 mt-mb-0">
                <h1 className="text-center mb-4">Регистрация</h1>
                <fieldset disabled={formik.isSubmitting}>
                  <Form.Group>
                    <Form.Control
                      onChange={formik.handleChange}
                      value={formik.values.username}
                      placeholder="Имя пользователя"
                      className={authFailed ? 'mb-3 form-control is-invalid' : 'mb-3 form-control'}
                      name="username"
                      id="username"
                      autoComplete="username"
                      isInvalid={authFailed}
                      required
                      ref={inputRef}
                    />
                  </Form.Group>
                  <Form.Group>
                    <Form.Control
                      type="password"
                      onChange={formik.handleChange}
                      value={formik.values.password}
                      placeholder="Пароль"
                      className={authFailed ? 'mb-3 form-control is-invalid' : 'mb-3 form-control'}
                      name="password"
                      id="password"
                      autoComplete="current-password"
                      isInvalid={authFailed}
                      required
                    />
                    <Form.Control.Feedback type="invalid">the username or password is incorrect</Form.Control.Feedback>
                  </Form.Group>
                  <Form.Group>
                    <Form.Control
                      type="password"
                      onChange={formik.handleChange}
                      value={formik.values.passwordConfirm}
                      placeholder="Подтвердите пароль"
                      className={authFailed ? 'mb-3 form-control is-invalid' : 'mb-3 form-control'}
                      name="passwordConfirm"
                      id="passwordConfirm"
                      isInvalid={authFailed}
                      required
                    />
                    <Form.Control.Feedback type="invalid">the username or password is incorrect</Form.Control.Feedback>
                  </Form.Group>
                  <Button type="submit" variant="outline-primary" className="w-100 btn btn-outline-primary">Зарегистрироваться</Button>
                </fieldset>
              </Form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
