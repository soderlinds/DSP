import React from 'react';
import { NavLink } from 'react-router-dom';
import { usePrivy } from '@privy-io/react-auth';
import { useNFTContext } from '../context/NFTContext'; 
import LoginLogoutButton from '../components/LoginLogoutButton';
import '../styles/_header.sass';

const Header = () => {
  const { renderUserNFTs } = useNFTContext(); 
  const { user } = usePrivy();
  
  const contractCreatorAddress = '0x2dCb11EeD42F6199658B66BC45D24470CcE2B710'; 
  const isAdmin = user && user.wallet && user.wallet.address.toLowerCase() === contractCreatorAddress.toLowerCase();
  const isLoggedIn = user;
  const hasFarcasterAccount = user && user.farcaster;
  
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
            {hasFarcasterAccount && <li><NavLink to="/farcaster" activeClassName="active">FARCASTER</NavLink></li>} 
            {isLoggedIn && <li><NavLink to="/mywallet" activeClassName="active">MY COLLECTION</NavLink></li>}
            {isAdmin && <li><NavLink to="/admin" activeClassName="active">ADMIN</NavLink></li>}
          </ul>
        </div>
        <div className="connected">
          <LoginLogoutButton size="small" /> 
          <span className="nft">{renderUserNFTs()}</span>
        </div>
      </nav>
    </header>
  );
};

export default Header;
