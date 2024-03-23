import React from 'react';
import { useNFTContext } from '../context/NFTContext'; 
import { usePrivy, useWallets } from '@privy-io/react-auth';

const LoggedInScreen = () => {
  const { error, handleMintNFT, renderUserNFTs, userNFTs } = useNFTContext(); 
  const { user, connectWallet} = usePrivy(); 
  const {wallets} = useWallets();
 
//Take away Connect to web3? Or keep an option to not have a wallet?
  const handleMintButtonClick = () => {
    if (userNFTs.length === 0 && user.wallet) {
      handleMintNFT();
    } else {
      connectWallet();
      wallets[0].loginOrLink();
    }
  };

  return (
    <div>
      <p>Your user ID: {user.id}</p>
      {user.wallet ? (
        userNFTs.length === 0 && <button onClick={handleMintButtonClick}>Mint Membership NFT</button>
      ) : (
        <button onClick={handleMintButtonClick}>Connect to web3</button>
      )}
      <div>
        {renderUserNFTs()}
      </div>
      {error && <p>{error}</p>}
    </div>
  );
};

export default LoggedInScreen;
