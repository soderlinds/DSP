import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import '../styles/_header.sass';

const Header = () => {
  return (
    <header className="header">
      <nav className="nav">
        <ul>
          <li><NavLink to="/" activeclassname="active">Home</NavLink></li>
          <li><NavLink to="/earn-tokens" activeclassname="active">Earn tokens</NavLink></li>
          <li><NavLink to="/ai" activeclassname="active">AI dialogues: co-creating live art</NavLink></li>
          <li><NavLink to="/merch" activeclassname="active">Merch</NavLink></li>
          <li><NavLink to="/sdv" activeclassname="active">SDVLOYALTYTOKEN</NavLink></li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
