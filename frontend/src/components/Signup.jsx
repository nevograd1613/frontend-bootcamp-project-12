import React, { useRef, useEffect, useState } from 'react';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button, Form } from 'react-bootstrap';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import useAuth from '../hooks/index.jsx';
import routes from '../routes.js';
import Entry from '../assets/signup.jpg';

const Signup = () => {
  const { t } = useTranslation();
  const auth = useAuth();
  const [authFailed, setAuthFailed] = useState(false);
  const inputRef = useRef();
  const location = useLocation();
  const navigate = useNavigate();
  useEffect(() => {
    inputRef.current.focus();
  }, []);
  const SignupSchema = Yup.object().shape({
    username: Yup.string()
      .trim()
      .min(3, t('registrationRules.name'))
      .max(20, t('registrationRules.name'))
      .required(t('errors.required')),
    password: Yup.string()
      .required(t('errors.required'))
      .min(6, t('registrationRules.password')),
    passwordConfirm: Yup.string()
      .oneOf([Yup.ref('password'), null], t('registrationRules.passwordEquality'))
      .required(t('errors.required')),
  });
  const formik = useFormik({
    initialValues: {
      username: '',
      password: '',
      passwordConfirm: '',
    },
    validationSchema: SignupSchema,
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
  console.log(formik);
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
                <h1 className="text-center mb-4">{t('registration')}</h1>
                <fieldset disabled={formik.isSubmitting}>
                  <Form.Group>
                    <Form.Control
                      onChange={formik.handleChange}
                      value={formik.values.username}
                      placeholder={t('placeholders.username')}
                      className={authFailed ? 'mb-3 form-control is-invalid' : 'mb-3 form-control'}
                      name="username"
                      id="username"
                      autoComplete="username"
                      isInvalid={!!formik.errors.username}
                      required
                      ref={inputRef}
                    />
                    <Form.Control.Feedback type="invalid">{formik.errors.username}</Form.Control.Feedback>
                  </Form.Group>
                  <Form.Group>
                    <Form.Control
                      type="password"
                      onChange={formik.handleChange}
                      value={formik.values.password}
                      placeholder={t('placeholders.password')}
                      className={authFailed ? 'mb-3 form-control is-invalid' : 'mb-3 form-control'}
                      name="password"
                      id="password"
                      autoComplete="current-password"
                      isInvalid={!!formik.errors.password}
                      required
                    />
                    <Form.Control.Feedback type="invalid">{formik.errors.password}</Form.Control.Feedback>
                  </Form.Group>
                  <Form.Group>
                    <Form.Control
                      type="password"
                      onChange={formik.handleChange}
                      value={formik.values.passwordConfirm}
                      placeholder={t('placeholders.passwordConfirmation')}
                      className={authFailed ? 'mb-3 form-control is-invalid' : 'mb-3 form-control'}
                      name="passwordConfirm"
                      id="passwordConfirm"
                      isInvalid={!!formik.errors.passwordConfirm}
                      required
                    />
                    <Form.Control.Feedback type="invalid">{formik.errors.passwordConfirm}</Form.Control.Feedback>
                  </Form.Group>
                  {authFailed ? <div className="invalid-feedback d-block">{t('errors.userExist')}</div> : null}
                  <Button type="submit" disabled={!!formik.errors.username || !!formik.errors.password || !!formik.errors.passwordConfirm} variant="outline-primary" className="w-100 btn btn-outline-primary">{t('register')}</Button>
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
