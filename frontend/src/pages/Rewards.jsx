import React, { useEffect, useState } from 'react';
import { useSmartContract } from '../SmartContractContext';
import '../styles/_rewards.sass'; 

const Rewards = () => {
  const { nftContract, purchaseNFT, mintNFT, tokenBalance } = useSmartContract();
  const [nfts, setNFTs] = useState([]);
  const [tokenIdInput, setTokenIdInput] = useState('');

  useEffect(() => {
    const fetchNFTs = async () => {
      const nftData = await fetchNFTData();
      setNFTs(nftData);
    };

    fetchNFTs();
  }, []);

  const fetchNFTData = async () => {
    try {
      const nftData = [];
      const mintedTokens = await nftContract.methods.getAllMintedNFTs().call();

      for (const tokenId of mintedTokens) {
        const tokenURI = `metadata/${tokenId}.json`; 
        const imageURI = `images/${tokenId}.png`;    

        const metadataResponse = await fetch(process.env.PUBLIC_URL + tokenURI);
        const metadata = await metadataResponse.json();

        const imageResponse = await fetch(process.env.PUBLIC_URL + imageURI);
        const imageData = await imageResponse.blob();
        const imageUrl = URL.createObjectURL(imageData);

        nftData.push({
          id: tokenId,
          image: imageUrl,
          metadata: metadata,
        });
      }

      console.log('Fetched NFTs:', nftData);

      return nftData;
    } catch (error) {
      console.error('Error fetching NFT data:', error);
      return [];
    }
  };

  const handlePurchaseNFT = async (tokenId) => {
    try {
        await purchaseNFT(tokenId); 
        const updatedNFTData = await fetchNFTData();
        setNFTs(updatedNFTData);
    } catch (error) {
        console.error('Error purchasing NFT:', error);
    }
};

  const handleMintNFT = async () => {
    try {
      const tokenId = Number(tokenIdInput);
      if (!isNaN(tokenId)) {
        await mintNFT(tokenId);
        console.log(`Successfully minted NFT with ID ${tokenId}`);

        console.log('Fetching updated NFT data...');
        const updatedNFTData = await fetchNFTData();
        console.log('Updated NFT Data:', updatedNFTData);

        setNFTs(updatedNFTData);
        setTokenIdInput('');
      } else {
        console.error('Invalid token ID');
      }
    } catch (error) {
      console.error('Error minting NFT:', error);
    }
  };

  return (
    <div>
      <h2>NFT Rewards Page</h2>
      <p>Your Token Balance: {tokenBalance}</p>
      <div>
        <h3>Mint NFT</h3>
        <label>
          Enter Token ID:
          <input
            type="text"
            value={tokenIdInput}
            onChange={(e) => setTokenIdInput(e.target.value)}
          />
        </label>
        <button onClick={handleMintNFT}>Mint NFT</button>
      </div>
      <div>
      <h3>Purchase NFT</h3>
      <div className="purchase-nfts">
        {nfts.map((nft) => (
          <div key={nft.id} className="nft-card">
            <img src={nft.image} alt={`NFT ${nft.id}`} />
            <p>{`Discount on tickets: ${nft.metadata.attributes[0].value}`}</p>
            <button onClick={() => handlePurchaseNFT(nft.id)}>Buy NFT</button>
          </div>
        ))}
        </div>
      </div>
    </div>
  );
};

export default Rewards;
