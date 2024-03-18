import React from 'react';
import useUserNFTs from '../hooks/useUserNFTs';
import { useSmartContract } from '../context/SmartContractContext'; 

const Web3LoggedInScreen = () => {
  const { error, handleMintNFT, renderUserNFTs, userNFTs } = useUserNFTs();
  const {account} = useSmartContract();

  return (
    <div>
      <p>Welcome {account}</p>
      {userNFTs.length === 0 && <button onClick={handleMintNFT}>Mint NFT</button>}
      <div>
        {renderUserNFTs()}
      </div>
      {error && <p>{error}</p>}
    </div>
  );
};

export default Web3LoggedInScreen;
