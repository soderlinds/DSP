import React from 'react';
import { NavLink } from 'react-router-dom';
import '../styles/_header.sass';
import { useSmartContract } from '../SmartContractContext';

const Header = () => {
  const { active, account } = useSmartContract();

  const contractCreatorAddress = '0x964D70403c038F1F9C73adcfA6066dd626B882C5'; // Hardcoded address for testing
  const isAdmin = account && account.toLowerCase() === contractCreatorAddress.toLowerCase();

  return (
    <header className="header">
      <nav className="nav">
        <div className="menu-container">
          <ul className="menu">
            <li><NavLink to="/" activeClassName="active">HOME</NavLink></li>
            <li><NavLink to="/quests" activeClassName="active">QUESTS</NavLink></li>
            <li><NavLink to="/ai" activeClassName="active">AI</NavLink></li>
            <li><NavLink to="/market" activeClassName="active">MARKET</NavLink></li>
            <li><NavLink to="/rewards" activeClassName="active">NFTs</NavLink></li>
            <li><NavLink to="/scoreboard" activeClassName="active">HIGHSCORE</NavLink></li>
            <li><NavLink to="/mywallet" activeClassName="active">"MY COLLECTION"</NavLink></li>
            {isAdmin && <li><NavLink to="/admin" activeClassName="active">ADMIN</NavLink></li>}
          </ul>
        </div>
      </nav>
    </header>
  );
};

export default Header;
