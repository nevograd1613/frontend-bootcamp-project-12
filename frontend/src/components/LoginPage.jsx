import React from 'react';
import * as Yup from 'yup';
import { Formik, Form, Field } from 'formik';
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
  const a = '';
  console.log(a);
  return (
    <div className="container-fluid h-100">
      <div className="row justify-content-center align-content-center h-100">
        <div className="col-12 col-md-8 col-xxl-6">
          <div className="card shadow-sm">
            <div className="card-body row p-5">
              <div className="col-12 col-md-6 d-flex align-items-center justify-content-center">
                <img src={Entry} className="rounded-circle" alt="Войти" />
              </div>
              <div className="col-12 col-md-6 mt-3 mt-mb-0">
                <h1 className="text-center mb-4">Войти</h1>
                <div className="form-floating mb-3">
                  <Formik
                    initialValues={{
                      username: '',
                      password: '',
                    }}
                    validationSchema={SignupSchema}
                    onSubmit={(values) => {
                      console.log(values);
                    }}
                  >
                    {({ errors, touched }) => (
                      <Form>
                        <label htmlFor="username">
                          <Field name="username" required="" placeholder="Ваш ник" id="username" className="form-control" value="" />
                          {errors.username && touched.username ? (
                            <div>{errors.username}</div>
                          ) : null}
                        </label>
                        <label className="form-label" htmlFor="password">
                          <Field name="password" required="" placeholder="Пароль" type="password" id="password" className="form-control" value="" />
                          {errors.password && touched.password ? (
                            <div>{errors.password}</div>
                          ) : null}
                        </label>
                        <button type="submit" className="w-100 mb-3 btn btn-outline-primary">Войти</button>
                      </Form>
                    )}
                  </Formik>
                </div>
              </div>
            </div>
            <div className="card-footer p-4">
              <div className="text-center">
                <span>Нет аккаунта?</span>
                <a href="/signup">Регистрация</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
