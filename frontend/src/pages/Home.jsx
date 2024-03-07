import React, { useState, useEffect } from 'react';
import { useSmartContract } from '../SmartContractContext';
import LoggedInSection from '../components/LoggedInSection';
import LoggedOutSection from '../components/LoggedOutSection';

function Home() {
  const { active, account, tokenBalance, mintMembershipToken, getUserNFT } = useSmartContract();
  const [userNFTs, setUserNFTs] = useState([]);
  const [isRegistering, setIsRegistering] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [isWeb2LoggedIn, setIsWeb2LoggedIn] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (active && account) {
      setIsLoggedIn(true);
    }
  }, [active, account]);

  useEffect(() => {
    const fetchUserNFTs = async () => {
      try {
        const nfts = await getUserNFT();
        setUserNFTs(nfts);
      } catch (error) {
        console.error('Error fetching user NFTs:', error);
        setError('Error fetching user NFTs');
      }
    };
  
    if (localStorage.getItem('isLoggedIn') === 'true') {
      setIsLoggedIn(true);
    }
  
    if (isLoggedIn) {
      fetchUserNFTs();
    }
  }, [isLoggedIn, getUserNFT]);

  const handleWeb3Registration = async () => {
    setIsRegistering(true);
    const metadataURI = '/metadata/membership_token_100.json'; // Example metadata URI for testing
  
    try {
      await mintMembershipToken(metadataURI);
      console.log("Membership NFT minted successfully!");
      await fetchUserNFTs();
    } catch (error) {
      console.error("Error minting membership NFT:", error);
      setError('Error minting membership NFT');
    } finally {
      setIsRegistering(false);
    }
  };

  const handleWeb2Registration = () => {
    console.log('Registering with Web2');
  };

  const handleLogin = (credentials, isWeb2) => {
    setUsername(credentials.username);
    setIsLoggedIn(true);
    setIsWeb2LoggedIn(isWeb2);
    localStorage.setItem('isLoggedIn', 'true'); 
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
    <div className="container">
      <h1>SDV LOYALTY GROUP</h1>
      {isLoggedIn ? (
        <LoggedInSection
          username={username}
          account={account}
          tokenBalance={tokenBalance}
          isWeb2={isWeb2LoggedIn} 
        />
      ) : (
        <LoggedOutSection
          active={active}
          handleLogin={handleLogin}
          handleWeb3Registration={handleWeb3Registration}
          handleWeb2Registration={handleWeb2Registration}
          isRegistering={isRegistering}
        />
      )}
      {error && <p>Error: {error}</p>}
      {isLoggedIn && (
        <>
          <button onClick={handleMintNFT}>Mint NFT</button>
          <div>
            {renderUserNFT()}
          </div>
        </>
      )}
    </div>
  );
}

export default Home;
