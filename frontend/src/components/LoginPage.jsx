import React, { useRef, useEffect, useState } from 'react';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button, Form } from 'react-bootstrap';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import useAuth from '../hooks/index.jsx';
import routes from '../routes.js';
import Entry from '../assets/Entry.jpeg';

const SignupSchema = Yup.object().shape({
  username: Yup.string()
    .trim()
    .min(2, 'Too Short!')
    .max(20, 'Too Long!')
    .required('Required'),
  password: Yup.string()
    .trim()
    .min(6, 'Too Short!')
    .max(50, 'Too Long!')
    .required('Required'),
});

const LoginPage = () => {
  const { t } = useTranslation();
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
    },
    SignupSchema,
    onSubmit: async (values) => {
      setAuthFailed(false);

      try {
        const res = await axios.post(routes.loginPath(), values);
        localStorage.setItem('userId', JSON.stringify(res.data));
        auth.logIn();
        const { from } = location.state || { from: { pathname: routes.mainPagePath() } };
        navigate(from);
      } catch (err) {
        formik.setSubmitting(false);
        if (err.isAxiosError && err.response.status === 401) {
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
                <h1 className="text-center mb-4">{t('entry')}</h1>
                <fieldset disabled={formik.isSubmitting}>
                  <Form.Floating>
                    <Form.Control
                      onChange={formik.handleChange}
                      value={formik.values.username}
                      placeholder={t('placeholders.login')}
                      className={authFailed ? 'mb-3 form-control is-invalid' : 'mb-3 form-control'}
                      name="username"
                      id="username"
                      autoComplete="username"
                      isInvalid={authFailed}
                      required
                      ref={inputRef}
                    />
                    <Form.Label htmlFor="username">{t('placeholders.login')}</Form.Label>
                  </Form.Floating>
                  <Form.Floating>
                    <Form.Control
                      type="password"
                      onChange={formik.handleChange}
                      value={formik.values.password}
                      placeholder={t('placeholders.password')}
                      className={authFailed ? 'mb-3 form-control is-invalid' : 'mb-3 form-control'}
                      name="password"
                      id="password"
                      autoComplete="current-password"
                      isInvalid={authFailed}
                      required
                    />
                    <Form.Label htmlFor="password">{t('placeholders.password')}</Form.Label>
                    <Form.Control.Feedback type="invalid">{t('errors.invalidFeedback')}</Form.Control.Feedback>
                  </Form.Floating>
                  <Button type="submit" variant="outline-primary" className="w-100 btn btn-outline-primary">{t('entry')}</Button>
                </fieldset>
              </Form>
            </div>
            <div className="card-footer p-4">
              <div className="text-center">
                <span>
                  {t('noAccount')}
                  &nbsp;
                </span>
                <a href="/signup">{t('registration')}</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
