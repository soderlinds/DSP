import React, { createContext, useContext, useState, useEffect } from 'react';
import { request } from 'graphql-request';
import { useSmartContract } from '../context/SmartContractContext';
import { usePrivy } from '@privy-io/react-auth';

const NFTContext = createContext();

export const useNFTContext = () => useContext(NFTContext);

export const NFTProvider = ({ children }) => {
  const { user } = usePrivy();
  const { mintMembershipToken } = useSmartContract();
  const [userNFTs, setUserNFTs] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchUserNFTs(user.wallet.address);
  }, [user.wallet.address]); 

  const fetchUserNFTs = async (owner) => {
    try {
      const query = `
        query FetchUserNFTs($owner: String!) {
          nftminteds(where: { owner: $owner }) {
            id
            owner
            tokenId
            metadataURI
            blockNumber
            blockTimestamp
            transactionHash
          }
        }
      `;

      const variables = { owner: owner.toLowerCase() }; 

      const data = await request('https://api.studio.thegraph.com/query/71099/sdv/version/latest', query, variables);

      const userNFTs = data.nftminteds;

      setUserNFTs(userNFTs);
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
      await fetchUserNFTs(user.wallet.address);
    } catch (error) {
      console.error("Error minting membership NFT:", error);
      setError('Error minting membership NFT');
    }
  };

  const renderUserNFTs = () => {
    if (userNFTs.length === 0) {
      return null; 
    }

    // Hardcoded image for testing
    return userNFTs.map((nft, index) => (
      <div key={index}>
        <img src={`/images/100.png`} alt={`NFT ID ${nft.tokenId}`} />
      </div>
    ));
  };

  return (
    <NFTContext.Provider value={{ userNFTs, error, handleMintNFT, renderUserNFTs }}>
      {children}
    </NFTContext.Provider>
  );
};
