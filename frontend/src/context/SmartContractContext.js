import React, { createContext, useContext, useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { contractABI, contractAddress } from '../config/contractConfig';
import { membershipContractABI, membershipContractAddress } from '../config/membershipContractConfig';
import { discountNFTContractABI, discountNFTContractAddress } from '../config/discountNFTContractConfig';
import { usePrivy, useWallets } from '@privy-io/react-auth';

const SmartContractContext = createContext();

export const useSmartContract = () => {
  return useContext(SmartContractContext);
};

export const SmartContractProvider = ({ children }) => {
  const [active, setActive] = useState(false);
  const [account, setAccount] = useState('');
  const [tokenBalance, setTokenBalance] = useState(0);
  const [userNFTs, setUserNFTs] = useState([]);
  const { user } = usePrivy(); 
  const {ready, wallets} = useWallets();

  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();
  const contract = new ethers.Contract(contractAddress, contractABI, signer);
  const membershipContract = new ethers.Contract(membershipContractAddress, membershipContractABI, signer);
  const discountNFTContract = new ethers.Contract(discountNFTContractAddress, discountNFTContractABI, signer);

  const mintMembershipToken = async (metadataURI) => {
    try {
      await membershipContract.mint(metadataURI);
    } catch (error) {
      console.error("Error minting membership NFT:", error);
    }
  };

  const getUserNFT = async () => {
    try {
      const filter = membershipContract.filters.NFTMinted(user.wallet.address, null, null);
      const events = await membershipContract.queryFilter(filter);
  
      const userNFTs = events.map(event => {
        const tokenId = event.args[1];
        const metadataURI = event.args[2];
        console.log("Displaying NFT with token ID", tokenId, "and metadata URI", metadataURI);
        return { tokenId, metadataURI };
      });
  
      return userNFTs;
    } catch (error) {
      console.error("Error fetching NFTs from event logs:", error);
      return [];
    }
  };
  
 
  const fetchBalances = async () => {
    try {
      if (account) {
        const balance = await contract.balanceOf(user.wallet.address);
        setTokenBalance(Number(balance));
        console.log("Token balance:", balance);
      }
    } catch (error) {
      console.error('Error fetching token balance:', error);
    }
  };

  const earnPoints = async (amount) => {
    try {
      await contract.earnPoints(amount);
    } catch (error) {
      console.error('Error earning points:', error);
    }
  };

  const exchangePointsForTokens = async (amount) => {
    try {
      await contract.exchangePointsForTokens(amount);
    } catch (error) {
      console.error('Error exchanging points for tokens:', error);
    }
  };

  const airdropTokens = async (users, amounts) => {
    try {
      await contract.airdropTokens(users, amounts);
    } catch (error) {
      console.error('Error airdropping tokens:', error);
    }
  };

  const buyMerch = async (amount) => {
    try {
      await contract.purchaseMerchandise(amount);
    } catch (error) {
      console.error('Error purchasing merchandise:', error);
    }
  };

  const contributeToPerformance = async (amount) => {
    try {
      await contract.contributeToPerformance(amount);
    } catch (error) {
      console.error('Error contributing to artwork:', error);
    }
  };

  const mintDiscountNFT = async (initialSupply, offchainPoints) => {
    try {
      await discountNFTContract.mint(initialSupply, offchainPoints);
      console.log("Discount NFT minted successfully!");
    } catch (error) {
      console.error("Error minting discount NFT:", error);
    }
  };

  const purchaseDiscountNFTWithPoints = async (tokenId, amount) => {
    try {
      await discountNFTContract.purchaseNFTWithPoints(tokenId, amount);
      console.log("Discount NFT purchased successfully with off-chain points!");
    } catch (error) {
      console.error("Error purchasing discount NFT with points:", error);
    }
  };

  return (
    <SmartContractContext.Provider
      value={{
        mintMembershipToken,
        fetchBalances,
        getUserNFT,
        active,
        account,
        tokenBalance,
        earnPoints,
        airdropTokens,
        buyMerch,
        exchangePointsForTokens,
        contributeToPerformance,
        mintDiscountNFT,
        discountNFTContract,
        purchaseDiscountNFTWithPoints,
      }}
    >
      {children}
    </SmartContractContext.Provider>
  );
};
