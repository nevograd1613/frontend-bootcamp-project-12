import React from 'react';

const Header = () => {
  const name = 'Hexlet Chat';
  return (
    <nav className="shadow-sm navbar navbar-expand-lg navbar-light bg-white">
      <div className="container">
        <a className="navbar-brand" href="/">{name}</a>
      </div>
    </nav>
  );
};

export default Header;
