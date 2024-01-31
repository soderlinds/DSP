import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import '../styles/_header.sass';

const Header = () => {
  return (
    <header className="header">
      <nav className="nav">
        <ul>
          <li><NavLink to="/" activeclassname="active">HOME</NavLink></li>
          <li><NavLink to="/earn-tokens" activeclassname="active">EARN TOKENS</NavLink></li>
          <li><NavLink to="/ai" activeclassname="active">AI DIALOGUES: co-creating live art</NavLink></li>
          <li><NavLink to="/merch" activeclassname="active">MERCH</NavLink></li>
          <li><NavLink to="/rewards" activeclassname="active">REWARDS</NavLink></li>
          <li><NavLink to="/sdv" activeclassname="active">SDVLOYALTYTOKEN</NavLink></li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
