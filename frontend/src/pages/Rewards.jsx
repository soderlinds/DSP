import React, { useEffect, useState } from 'react';
import { useSmartContract } from '../SmartContractContext';
import '../styles/_rewards.sass';

const Rewards = () => {
  const { nftContract, discountNFTContract, purchaseNFT, tokenBalance, approveTokenSpending } = useSmartContract();
  const [nfts, setNFTs] = useState([]);

  const contractOwnerAddress = "0x964d70403c038f1f9c73adcfa6066dd626b882c5"; //hardcoded for testing

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
      const mintedTokens = await discountNFTContract.methods.getAllMintedNFTs().call();
  
      for (const tokenIdBN of mintedTokens) {
        const tokenId = Number(tokenIdBN);
  
        const tokenURI = `metadata/${tokenId}.json`;
        const imageURI = `images/${tokenId}.png`;
  
        const metadataResponse = await fetch(process.env.PUBLIC_URL + tokenURI);
        const metadata = await metadataResponse.json();
  
        const imageResponse = await fetch(process.env.PUBLIC_URL + imageURI);
        const imageData = await imageResponse.blob();
        const imageUrl = URL.createObjectURL(imageData);
  
        const nftPrice = await discountNFTContract.methods.nftPrice(tokenId).call(); 
  
        nftData.push({
          id: tokenId,
          image: imageUrl,
          metadata: metadata,
          nftPrice: nftPrice, 
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
      const nftPrice = await nftContract.methods.getNFTPrice(tokenId).call();
      
      const approvalAmount = nftPrice; 
      await approveTokenSpending(approvalAmount);

      await purchaseNFT(tokenId);
  
      const updatedNFTData = await fetchNFTData();
      setNFTs(updatedNFTData);
    } catch (error) {
      console.error('Error purchasing NFT:', error);
    }
  };

  const unclaimedNFTs = nfts.filter(nft => nft.owner === null || contractOwnerAddress );

  return (
    <div className="rewards-wrapper">
      <div>
        <h2>NFTs</h2>
        <div className="purchase-nfts">
           {unclaimedNFTs.map((nft) => (
            <div key={nft.id} className="nft-card">
              <img src={nft.image} alt={`NFT ${nft.id}`} />
              <p className="discount-text">{`Discount on tickets: ${nft.metadata.attributes[0].value}`}</p>
              <p className="nft-text">{`Price: ${nft.nftPrice}`}</p>
              <button onClick={() => handlePurchaseNFT(nft.id)}>Claim NFT</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Rewards;

