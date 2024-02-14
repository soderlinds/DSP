import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useSmartContract } from '../SmartContractContext';
import '../styles/_header.sass';

const Header = () => {
  const { account } = useSmartContract();
  const contractCreatorAddress = '0x964D70403c038F1F9C73adcfA6066dd626B882C5'; // Hardcoded address for testing
  const isAdmin = account && account.toLowerCase() === contractCreatorAddress.toLowerCase();

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
          <li><NavLink to="/mywallet" activeclassname="active">MY WALLET</NavLink></li>
          {isAdmin && <li><NavLink to="/admin" activeclassname="active">ADMIN</NavLink></li>}
        </ul>
      </nav>
    </header>
  );
};

export default Header;
