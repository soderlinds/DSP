import React from 'react';
import { NavLink } from 'react-router-dom';
import { useWeb2Auth } from '../context/Web2AuthContext';
import { useNFTContext } from '../context/NFTContext'; 
import { useSmartContract } from '../context/SmartContractContext';
import ConnectButton from './ConnectButton';
import '../styles/_header.sass';

const Header = () => {
  const { account } = useSmartContract();
  const { renderUserNFTs } = useNFTContext(); 
  const { userId } = useWeb2Auth();

  const identifier = account || userId;

  const contractCreatorAddress = '0x2dCb11EeD42F6199658B66BC45D24470CcE2B710'; 
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
            <li><NavLink to="/leaderboard" activeClassName="active">LEADERBOARD</NavLink></li>
            {isLoggedIn && <li><NavLink to="/mywallet" activeClassName="active">MY COLLECTION</NavLink></li>}
            {isAdmin && <li><NavLink to="/admin" activeClassName="active">ADMIN</NavLink></li>}
          </ul>
        </div>
        <div className="connected">
          <ConnectButton size="small" />
          {renderUserNFTs()}
        </div>
      </nav>
    </header>
  );
};

export default Header;
