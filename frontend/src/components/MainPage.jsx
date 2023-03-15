import React from 'react';
import { Link } from 'react-router-dom';

const MainPage = () => {
  const a = '';
  console.log(a);
  return (
    <div className="text-center">
      <h1 className="h4 text-muted">{}</h1>
      <p className="text-muted">
        <Link to="/">{}</Link>
      </p>
    </div>
  );
};

export default MainPage;
