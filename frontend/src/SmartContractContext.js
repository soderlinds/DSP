import React, { createContext, useContext, useState, useEffect } from 'react';
import Web3 from 'web3';
import { contractABI, contractAddress } from './contractConfig';
import { membershipContractABI, membershipContractAddress } from './membershipContractConfig';
import { discountNFTContractABI, discountNFTContractAddress } from './discountNFTContractConfig';
import { artworkNFTContractABI, artworkNFTContractAddress } from './artworkNFTContractConfig';

const SmartContractContext = createContext();

export const useSmartContract = () => {
  return useContext(SmartContractContext);
};

export const SmartContractProvider = ({ children }) => {
  const [active, setActive] = useState(false);
  const [account, setAccount] = useState('');
  const [tokenBalance, setTokenBalance] = useState(0);
  const [pointsBalance, setPointsBalance] = useState(0);
  const [commonPoolBalance, setCommonPoolBalance] = useState(0);
  const [userNFTs, setUserNFTs] = useState('');


  useEffect(() => {
    const loadWeb3 = async () => {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        setActive(true);
        setAccount(accounts[0]);
      } catch (error) {
        console.error('Error loading MetaMask:', error);
      }
    };

    loadWeb3();
  }, []);

  const web3 = new Web3(window.ethereum);
  const contract = new web3.eth.Contract(contractABI, contractAddress);
  const membershipContract = new web3.eth.Contract(membershipContractABI, membershipContractAddress);
  const discountNFTContract = new web3.eth.Contract(discountNFTContractABI, discountNFTContractAddress);
  const artworkNFTContract = new web3.eth.Contract(artworkNFTContractABI, artworkNFTContractAddress);

  // Membership
  
  const mintMembershipToken = async (metadataURI) => {
    try {
      await membershipContract.methods.mint(metadataURI).send({ from: account });

      await getUserNFTs();
    } catch (error) {
      console.error("Error minting membership NFT:", error);
    }
  };

  const checkMembership = async () => {
    try {
      const isMember = await membershipContract.methods.isMember(account).call();
      console.log("Is member:", isMember);
    } catch (error) {
      console.error("Error checking membership:", error);
    }
  };
  
  const getUserNFTs = async () => {
    try {
      const userNFTIdsBig = await membershipContract.methods.getUserNFTs(account).call();
      const userNFTIds = userNFTIdsBig.map(id => id.toString());
      setUserNFTs(userNFTIds);
      console.log("User's NFT:", userNFTIds);
      return userNFTIds; 
    } catch (error) {
      console.error("Error fetching user's NFT:", error);
      return []; 
    }
  };
  
  const getUserNFTMetadataURI = async (nftId) => {
    try {
      const metadataURI = await membershipContract.methods.uri(nftId).call(); 
      return metadataURI;
    } catch (error) {
      console.error('Error fetching user NFT metadata URI:', error);
      return '';
    }
  };


  // SDV Token
  useEffect(() => {
    const fetchBalances = async () => {
      try {
        if (account) {
          const balance = await contract.methods.balanceOf(account).call();
          setTokenBalance(Number(balance));
          console.log("Token balance:", balance);
        }
      } catch (error) {
        console.error('Error fetching token balance:', error);
      }
    };

    fetchBalances();
  }, [account]);

 
  useEffect(() => {
    const fetchCommonPoolBalance = async () => {
      try {
        const commonPoolBalance = await contract.methods.getCommonPoolBalance().call();
        setCommonPoolBalance(Number(commonPoolBalance));
        console.log("Common pool balance:", commonPoolBalance);
      } catch (error) {
        console.error('Error fetching common pool balance:', error);
      }
    };

    fetchCommonPoolBalance();
  }, []);

  const earnPoints = async (amount) => {
    try {
      await contract.methods.earnPoints(amount).send({ from: account, gas: 300000 });
    } catch (error) {
      console.error('Error earning points:', error);
    }
  };

  const exchangePointsForTokens = async (amount) => {
    try {
      await contract.methods.exchangePointsForTokens(amount).send({ from: account, gas: 300000 });
    } catch (error) {
      console.error('Error exchanging points for tokens:', error);
    }
  };

  const airdropTokens = async (users, amounts) => {
    try {
      await contract.methods.airdropTokens(users, amounts).send({ from: account, gas: 300000 });
    } catch (error) {
      console.error('Error airdropping tokens:', error);
    }
  };

  const buyMerch = async (amount) => {
    try {
      await contract.methods.purchaseMerchandise(amount).send({ from: account, gas: 300000 });
    } catch (error) {
      console.error('Error purchasing merchandise:', error);
    }
  };

  const contributeToPerformance = async (amount) => {
    try {
      await contract.methods.contributeToPerformance(amount).send({ from: account, gas: 300000 });
    } catch (error) {
      console.error('Error contributing to artwork:', error);
    }
  };


  //Discount NFT

  const mintDiscountNFT = async (tokenId, nftPrice, initialSupply) => {
    try {
      await discountNFTContract.methods.mint(tokenId, nftPrice, initialSupply).send({ from: account });
      console.log("Discount NFT minted successfully!");
    } catch (error) {
      console.error("Error minting discount NFT:", error);
    }
  };
  
  const purchaseDiscountNFTWithPoints = async (tokenId, amount, offchainPoints) => {
    try {
      await discountNFTContract.methods.purchaseNFTWithPoints(tokenId, amount, offchainPoints).send({ from: account });
      console.log("Discount NFT purchased successfully with off-chain points!");
    } catch (error) {
      console.error("Error purchasing discount NFT with points:", error);
    }
  };
  
  const setDiscountNFTPrice = async (tokenId, newNFTPrice) => {
    try {
      await discountNFTContract.methods.setNFTPrice(tokenId, newNFTPrice).send({ from: account });
      console.log("Discount NFT price set successfully!");
    } catch (error) {
      console.error("Error setting discount NFT price:", error);
    }
  };
  
  //Artwork NFT
  const createNFT = async (artist) => {
    try {
      await artworkNFTContract.methods.createNFT(artist).send({ from: account });
    } catch (error) {
      console.error('Error creating NFT:', error);
    }
  };

  const fractionalizeNFT = async (totalShares) => {
    try {
      await artworkNFTContract.methods.fractionalizeNFT(totalShares).send({ from: account });
    } catch (error) {
      console.error('Error fractionalizing NFT:', error);
    }
  };

  const mint1155NFT = async (to, amount) => {
    try {
      await artworkNFTContract.methods.mint(to, amount).send({ from: account });
    } catch (error) {
      console.error('Error minting NFT:', error);
    }
  };

  const setAttendee = async (attendee) => {
    try {
      await artworkNFTContract.methods.setAttendee(attendee).send({ from: account });
    } catch (error) {
      console.error('Error setting attendee:', error);
    }
  };

  const airdropNFTShares = async (participants) => {
    try {
      await artworkNFTContract.methods.airdropNFTShares(participants).send({ from: account });
    } catch (error) {
      console.error('Error airdropping NFT shares:', error);
    }
  };


  return (
    <SmartContractContext.Provider
      value={{
        mintMembershipToken,
        checkMembership,
        getUserNFTs,
        getUserNFTMetadataURI,
        active,
        account,
        tokenBalance,
        pointsBalance,
        airdropTokens,
        buyMerch,
        contributeToPerformance,
        mintDiscountNFT,
        setDiscountNFTPrice,
        purchaseDiscountNFTWithPoints,
        createNFT,
        fractionalizeNFT,
        mint1155NFT,
        setAttendee,
        airdropNFTShares,
        web3,
        earnPoints,
        exchangePointsForTokens,
        commonPoolBalance,
      }}
    >
      {children}
    </SmartContractContext.Provider>
  );
};
