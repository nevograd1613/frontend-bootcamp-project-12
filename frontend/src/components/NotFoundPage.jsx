import React from 'react';
import { Link } from 'react-router-dom';

import notFoundImg from '../assets/Search.svg';

const NotFoundPage = () => {
  const mainPage = 'на главную страницу';
  return (
    <div className="text-center">
      <img src={notFoundImg} alt="Страница не найдена" className="img-fluid h-25" />
      <h1 className="h4 text-muted">Страница не найдена</h1>
      <p className="text-muted">
        Но вы можете перейти
        <Link to="/">{mainPage}</Link>
      </p>
    </div>
  );
};

export default NotFoundPage;
