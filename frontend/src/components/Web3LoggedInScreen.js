import React, { useEffect, useState } from 'react';
import { useSmartContract } from '../context/SmartContractContext'; 


const Web3LoggedInScreen = () => {
  const { account, getUserNFT, mintMembershipToken } = useSmartContract();
  const [userNFTs, setUserNFTs] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchUserNFTs();
  }, []); 

  const fetchUserNFTs = async () => {
    try {
      const nfts = await getUserNFT();
      setUserNFTs(nfts);
      setError('');
    } catch (error) {
      console.error('Error fetching user NFTs:', error);
      setError('Error fetching user NFTs');
    }
  };

  const handleMintNFT = async () => {
    try {
      await mintMembershipToken('/metadata/membership_token_100.json'); 
      console.log("Membership NFT minted successfully!");
      await fetchUserNFTs(); 
    } catch (error) {
      console.error("Error minting membership NFT:", error);
      setError('Error minting membership NFT');
    }
  };

  const renderUserNFT = () => {
    if (userNFTs.length === 0) {
      return <p>No NFT found</p>;
    }

    return userNFTs.map((nft, index) => (
      <div key={index}>
        <img src={nft.metadataURI} alt={`NFT ID ${nft.tokenId}`} />
      </div>
    ));
  };

  return (
    <div>
      <p>Welcome {account}</p>
      <button onClick={handleMintNFT}>Mint NFT</button>
      <div>
        {renderUserNFT()}
      </div>
      {error && <p>{error}</p>}
    </div>
  );
};

export default Web3LoggedInScreen;
