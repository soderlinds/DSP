import React from 'react';
import { NavLink } from 'react-router-dom';
import { useWeb2Auth } from '../context/Web2AuthContext'; 
import { useSmartContract } from '../context/SmartContractContext';
import ConnectButton from './ConnectButton';
import '../styles/_header.sass';

const Header = () => {
  const { account } = useSmartContract(); 
  const { userId } = useWeb2Auth();

  const identifier = account || userId;

  const contractCreatorAddress = '0x964D70403c038F1F9C73adcfA6066dd626B882C5'; // Hardcoded address for testing
  const isAdmin = account && account.toLowerCase() === contractCreatorAddress.toLowerCase();
  const isLoggedIn = identifier !== null;

  return (
    <header className="header">
      <nav className="nav">
        <div className="menu-wrapper">
          <ul className="menu">
            <li><NavLink to="/" activeClassName="active">HOME</NavLink></li>
            <li><NavLink to="/quests" activeClassName="active">QUESTS</NavLink></li>
            <li><NavLink to="/ai" activeClassName="active">AI</NavLink></li>
            <li><NavLink to="/market" activeClassName="active">MARKET</NavLink></li>
            <li><NavLink to="/rewards" activeClassName="active">NFTs</NavLink></li>
            <li><NavLink to="/scoreboard" activeClassName="active">HIGHSCORE</NavLink></li>
            {isLoggedIn && <li><NavLink to="/mywallet" activeClassName="active">MY COLLECTION</NavLink></li>}
            {isAdmin && <li><NavLink to="/admin" activeClassName="active">ADMIN</NavLink></li>}
          </ul>
        </div>
        <div>
          <ConnectButton size="small" />
        </div>
      </nav>
      
    </header>
  );
};

export default Header;
