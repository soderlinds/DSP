import React, { createContext, useContext, useState, useEffect } from 'react';
import Web3 from 'web3';
import { contractABI, contractAddress } from './contractConfig';
import { nftContractABI, nftContractAddress } from './nftContractConfig';

const SmartContractContext = createContext();

export const useSmartContract = () => {
  return useContext(SmartContractContext);
};

export const SmartContractProvider = ({ children }) => {
  const [active, setActive] = useState(false);
  const [account, setAccount] = useState('');
  const [tokenBalance, setTokenBalance] = useState(0);
  const [pointsBalance, setPointsBalance] = useState(0); 
  const [ownedNFTs, setOwnedNFTs] = useState([]);

  const web3 = new Web3(window.ethereum);
  const contract = new web3.eth.Contract(contractABI, contractAddress);
  const nftContract = new web3.eth.Contract(nftContractABI, nftContractAddress);

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

  useEffect(() => {
    const fetchBalances = async () => {
      try {
        if (account) {
          const balance = await contract.methods.balanceOf(account).call();
          setTokenBalance(balance.toString());
        }
      } catch (error) {
        console.error('Error fetching balances:', error);
      }
    };

    fetchBalances();
  }, [account]);

  useEffect(() => {
    const fetchPointsBalance = async () => {
      try {
        if (account) {
          const points = await contract.methods.getPointsBalance(account).call();
          setPointsBalance(points.toString());
        }
      } catch (error) {
        console.error('Error fetching points balance:', error);
      }
    };

    fetchPointsBalance();
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


  useEffect(() => {
    const fetchOwnedNFTs = async () => {
      try {
        if (account) {
          const ownedTokens = await nftContract.methods.getOwnedNFTs(account).call();
          setOwnedNFTs(ownedTokens);
        }
      } catch (error) {
        console.error('Error fetching owned NFTs:', error);
      }
    };

    fetchOwnedNFTs();
  }, [account]);

  const earnTokens = async (amount) => {
    try {
      await contract.methods.earnTokens(amount).send({ from: account, gas: 300000 });
    } catch (error) {
      console.error('Error earning tokens:', error);
    }
  };

  const registerUser = async (email) => {
    try {
      await contract.methods.registerUser(email).send({ from: account, gas: 300000 });
    } catch (error) {
      console.error('Error registering user:', error);
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

  const mintNFT = async (tokenId, nftPrice) => {
    try {
      await nftContract.methods.mint(tokenId, nftPrice).send({ from: account, gas: 300000 });
    } catch (error) {
      console.error('Error minting NFT:', error);
    }
  };

  const purchaseNFT = async (tokenId) => {
    try {
      const transactionData = { from: account, gas: 300000 };
      await nftContract.methods.purchaseNFT(tokenId).send(transactionData);
    } catch (error) {
      console.error('Error purchasing NFT:', error);
      throw error;
    }
  };

  const approveTokenSpending = async (amount) => {
    try {
      const amountString = amount.toString();

      await contract.methods.approve(nftContractAddress, amountString).send({ from: account });
  
      console.log(`Successfully approved spending ${amountString} tokens for the NFT contract`);
    } catch (error) {
      console.error('Error approving token spending:', error);
      throw error;
    }
  };

  return (
    <SmartContractContext.Provider
      value={{
        active,
        account,
        tokenBalance,
        pointsBalance,
        earnTokens,
        registerUser,
        airdropTokens,
        buyMerch,
        contributeToPerformance,
        mintNFT,
        purchaseNFT,
        approveTokenSpending,
        ownedNFTs,
        nftContract,
        web3,
        earnPoints,
        exchangePointsForTokens,
      }}
    >
      {children}
    </SmartContractContext.Provider>
  );
};
