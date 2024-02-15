import React from 'react';
import { NavLink } from 'react-router-dom';
import '../styles/_header.sass';
import useCurrentUserStatus from '../hooks/useCurrentUserStatus';
import { useSmartContract } from '../SmartContractContext';


const Header = () => {
  const { active, account } = useSmartContract();
  const currentUserStatus = useCurrentUserStatus();


  const contractCreatorAddress = '0x964D70403c038F1F9C73adcfA6066dd626B882C5'; // Hardcoded address for testing
  const isAdmin = account && account.toLowerCase() === contractCreatorAddress.toLowerCase();

  return (
    <header className="header">
      <nav className="nav">
        <div className="menu-container">
          <ul className="menu">
            <li><NavLink to="/" activeClassName="active">HOME</NavLink></li>
            <li><NavLink to="/earn-tokens" activeClassName="active">EARN TOKENS</NavLink></li>
            <li><NavLink to="/ai" activeClassName="active">AI DIALOGUES: co-creating live art</NavLink></li>
            <li><NavLink to="/merch" activeClassName="active">MERCH</NavLink></li>
            <li><NavLink to="/rewards" activeClassName="active">REWARDS</NavLink></li>
            <li><NavLink to="/mywallet" activeClassName="active">MY WALLET</NavLink></li>
            {isAdmin && <li><NavLink to="/admin" activeClassName="active">ADMIN</NavLink></li>}
          </ul>
        </div>
        <div className={`userStatus status${currentUserStatus}`} />
      </nav>
    </header>
  );
};

export default Header;
