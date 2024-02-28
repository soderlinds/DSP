import React, { useState, useEffect } from 'react';
import { useSmartContract } from '../SmartContractContext';
import LoggedInSection from '../components/LoggedInSection';
import LoggedOutSection from '../components/LoggedOutSection';

function Home() {
  const { active, account, tokenBalance, getUserNFTs, getUserNFTMetadataURI, mintMembershipToken } = useSmartContract();
  const [userNFTs, setUserNFTs] = useState([]);
  const [nftImages, setNftImages] = useState([]);
  const [isRegistering, setIsRegistering] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [isWeb2LoggedIn, setIsWeb2LoggedIn] = useState(false); 

  useEffect(() => {
    const fetchUserNFTs = async () => {
      try {
        if (account) {
          const userNFTIds = await getUserNFTs();
          setUserNFTs(userNFTIds.map(id => id.toString()));
        }
      } catch (error) {
        console.error('Error fetching user NFTs:', error);
      }
    };

    fetchUserNFTs();
  }, [account]);

  useEffect(() => {
    const fetchNFTImages = async () => {
      try {
        const imagePromises = userNFTs.map(async (tokenId) => {
          const metadataURI = await getUserNFTMetadataURI(tokenId);
          const response = await fetch(metadataURI);
          const metadata = await response.json();
          const imageUrl = metadata.image;
          return imageUrl;
        });

        Promise.all(imagePromises)
          .then((imageUrls) => {
            setNftImages(imageUrls);
          })
          .catch((error) => {
            console.error('Error fetching NFT images:', error);
          });
      } catch (error) {
        console.error('Error fetching NFT images:', error);
      }
    };

    fetchNFTImages();
  }, [userNFTs]);

  useEffect(() => {
    if (active && account) {
      setIsLoggedIn(true);
    }
  }, [active, account]);

  const handleWeb3Registration = async () => {
    setIsRegistering(true);
    const metadataURI = '/metadata/membership_token_100.json'; // Example metadata URI for testing
  
    try {
      await mintMembershipToken(metadataURI);
      console.log("Membership NFT minted successfully!");
    } catch (error) {
      console.error("Error minting membership NFT:", error);
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
    } catch (error) {
      console.error("Error minting membership NFT:", error);
    }
  };

  return (
    <div className="container">
      <h1>SDV LOYALTY GROUP</h1>
      {isLoggedIn ? (
        <LoggedInSection
          username={username}
          account={account}
          tokenBalance={tokenBalance}
          nftImages={nftImages}
          userNFTs={userNFTs}
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
      <button onClick={handleMintNFT}>Mint NFT</button>

    </div>
  );
}

export default Home;
