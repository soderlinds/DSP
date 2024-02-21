import React, { createContext, useContext, useState, useEffect } from 'react';
import Web3 from 'web3';
import { contractABI, contractAddress } from './contractConfig';
import { nftContractABI, nftContractAddress } from './nftContractConfig';
import { nft1155ContractABI, nft1155ContractAddress } from './nft1155ContractConfig';
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
  const [userStatuses, setUserStatuses] = useState({}); 
  const [commonPoolBalance, setCommonPoolBalance] = useState(0);

  const web3 = new Web3(window.ethereum);
  const contract = new web3.eth.Contract(contractABI, contractAddress);
  const nftContract = new web3.eth.Contract(nftContractABI, nftContractAddress);
  const nft1155Contract = new web3.eth.Contract(nft1155ContractABI, nft1155ContractAddress);

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
          setTokenBalance(Number(balance));
          console.log(balance);
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

  useEffect(() => {
    const fetchCommonPoolBalance = async () => {
      try {
        const commonPoolBalance = await contract.methods.getCommonPoolBalance().call();
        setCommonPoolBalance(Number(commonPoolBalance));
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


  useEffect(() => {
    const fetchOwnedNFTs = async () => {
      try {
        if (account) {
          const ownedTokensNFT = await nftContract.methods.getOwnedNFTs(account).call();
          const ownedTokensNFT1155 = await nft1155Contract.methods.getOwnedNFTs(account).call();
  
          const ownedTokens = [...ownedTokensNFT, ...ownedTokensNFT1155];
          
          setOwnedNFTs(ownedTokens);
        }
      } catch (error) {
        console.error('Error fetching owned NFTs:', error);
      }
    };
  
    fetchOwnedNFTs();
  }, [account]);


  useEffect(() => {
    const fetchUserStatuses = async () => {
      try {
        if (account) {
          const allUsers = await contract.methods.getAllUsers().call();
          const userStatuses = {};
    
          for (const user of allUsers[0]) {
            const status = await contract.methods.getStatus(user).call();
            userStatuses[user] = Number(status); 
          }
    
          console.log('Fetched User Statuses:', userStatuses);
    
          setUserStatuses(userStatuses);
        }
      } catch (error) {
        console.error('Error fetching user statuses:', error);
      }
    };
    
  
    fetchUserStatuses();
  }, [account]);

  const fetchUsers = async () => {
    try {
      if (account) {
        const allUsers = await contract.methods.getAllUsers().call();
        const usersWithStatus = [];
  
        for (const user of allUsers[0]) {
          const status = await contract.methods.getStatus(user).call();
          usersWithStatus.push({ user, status: Number(status) });
        }
  
        return usersWithStatus;
      }
    } catch (error) {
      console.error('Error fetching users:', error);
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

  const createNFT = async (artist) => {
    try {
      await nft1155Contract.methods.createNFT(artist).send({ from: account });
    } catch (error) {
      console.error('Error creating NFT:', error);
    }
  };

  const fractionalizeNFT = async (totalShares) => {
    try {
      await nft1155Contract.methods.fractionalizeNFT(totalShares).send({ from: account });
    } catch (error) {
      console.error('Error fractionalizing NFT:', error);
    }
  };

  const mint1155NFT = async (to, amount) => {
    try {
      await nft1155Contract.methods.mint(to, amount).send({ from: account });
    } catch (error) {
      console.error('Error minting NFT:', error);
    }
  };

  const setAttendee = async (attendee) => {
    try {
      await nft1155Contract.methods.setAttendee(attendee).send({ from: account });
    } catch (error) {
      console.error('Error setting attendee:', error);
    }
  };

  const airdropNFTShares = async (participants) => {
    try {
      await nft1155Contract.methods.airdropNFTShares(participants).send({ from: account });
    } catch (error) {
      console.error('Error airdropping NFT shares:', error);
    }
  };

  return (
    <SmartContractContext.Provider
      value={{
        active,
        account,
        tokenBalance,
        pointsBalance,
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
        fetchUsers,
        createNFT,
        setAttendee,
        mint1155NFT,
        fractionalizeNFT,
        airdropNFTShares,
        nft1155Contract,
        commonPoolBalance,
      }}
    >
      {children}
    </SmartContractContext.Provider>
  );
};
