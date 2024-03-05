import React, { createContext, useContext, useState, useEffect } from 'react';
import Web3 from 'web3';
import { contractABI, contractAddress } from './config/contractConfig';
import { membershipContractABI, membershipContractAddress } from './config//membershipContractConfig';
import { discountNFTContractABI, discountNFTContractAddress } from './config/discountNFTContractConfig';
import { productionNFTContractABI, productionNFTContractAddress } from './config/productionNFTContractConfig';

const SmartContractContext = createContext();

export const useSmartContract = () => {
  return useContext(SmartContractContext);
};

export const SmartContractProvider = ({ children }) => {
  const [active, setActive] = useState(false);
  const [account, setAccount] = useState('');
  const [tokenBalance, setTokenBalance] = useState(0);
  const [pointsBalance, setPointsBalance] = useState(0);
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
  const productionNFTContract = new web3.eth.Contract(productionNFTContractABI, productionNFTContractAddress);

  // Membership

  const mintMembershipToken = async (metadataURI) => {
    try {
      await membershipContract.methods.mint(metadataURI).send({ from: account });
    } catch (error) {
      console.error("Error minting membership NFT:", error);
    }
  };

  const getUserNFT = async () => {
    try {
      const events = await membershipContract.getPastEvents('NFTMinted', {
        fromBlock: 0,
        toBlock: 'latest'
      });
  
        const userNFTs = events.map(event => {
        const tokenId = event.returnValues.tokenId;
        const metadataURI = event.returnValues.metadataURI;
        console.log("Displaying NFT with token ID", tokenId, "and metadata URI", metadataURI);
        return { tokenId, metadataURI };
      });
  
      return userNFTs;
    } catch (error) {
      console.error("Error fetching NFTs from event logs:", error);
      return [];
    }
  };

  useEffect(() => {
    getUserNFT()
      .then(nfts => setUserNFTs(nfts))
      .catch(error => console.error('Error fetching user NFTs:', error));
  }, []);
  


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

  const mintDiscountNFT = async (tokenId, initialSupply, nftPrice ) => {
    try {
      await discountNFTContract.methods.mint(tokenId, initialSupply, nftPrice).send({ from: account, gas: 300000  });
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
  
  
  
  //Artwork NFT
  const createNFT = async (artist) => {
    try {
      await productionNFTContract.methods.createNFT(artist).send({ from: account });
    } catch (error) {
      console.error('Error creating NFT:', error);
    }
  };

  const fractionalizeNFT = async (totalShares) => {
    try {
      await productionNFTContract.methods.fractionalizeNFT(totalShares).send({ from: account });
    } catch (error) {
      console.error('Error fractionalizing NFT:', error);
    }
  };

  const mint1155NFT = async (to, amount) => {
    try {
      await productionNFTContract.methods.mint(to, amount).send({ from: account });
    } catch (error) {
      console.error('Error minting NFT:', error);
    }
  };

  const setAttendee = async (attendee) => {
    try {
      await productionNFTContract.methods.setAttendee(attendee).send({ from: account });
    } catch (error) {
      console.error('Error setting attendee:', error);
    }
  };

  const airdropNFTShares = async (participants) => {
    try {
      await productionNFTContract.methods.airdropNFTShares(participants).send({ from: account });
    } catch (error) {
      console.error('Error airdropping NFT shares:', error);
    }
  };


  return (
    <SmartContractContext.Provider
      value={{
        mintMembershipToken,
        getUserNFT,
        active,
        account,
        tokenBalance,
        pointsBalance,
        airdropTokens,
        buyMerch,
        contributeToPerformance,
        mintDiscountNFT,
        discountNFTContract,
        purchaseDiscountNFTWithPoints,
        createNFT,
        fractionalizeNFT,
        mint1155NFT,
        setAttendee,
        airdropNFTShares,
        web3,
        earnPoints,
        exchangePointsForTokens,
      }}
    >
      {children}
    </SmartContractContext.Provider>
  );
};
