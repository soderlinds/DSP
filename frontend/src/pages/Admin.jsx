import React, { useState } from 'react';
import { useSmartContract } from '../SmartContractContext';
import '../styles/_admin.sass';

const Admin = () => {
  const { createNFT, fractionalizeNFT, setAttendee, airdropNFTShares, mintDiscountNFT } = useSmartContract();
  const [artistAddress, setArtistAddress] = useState('');
  const [totalShares, setTotalShares] = useState(0);
  const [attendeeAddress, setAttendeeAddress] = useState('');
  const [tokenIdInput, setTokenIdInput] = useState('');
  const [pointsInput, setPointsInput] = useState('');
  const [initialSupplyInput, setInitialSupplyInput] = useState('');

//Production NFT
  const handleCreateNFT = async () => {
    await createNFT(artistAddress);
  };

  const handleFractionalizeNFT = async () => {
    await fractionalizeNFT(totalShares);
  };

  const handleSetAttendee = async () => {
    await setAttendee(attendeeAddress);
  };
  
  const handleAirdropNFTShares = async () => {
    await airdropNFTShares([attendeeAddress]);
  };

  //Discount NFT
  const handleMintNFT = async () => {
    try {
        const tokenId = Number(tokenIdInput);
        const initialSupply = Number(initialSupplyInput); 
        const offchainPoints = Number(pointsInput);

        if (!isNaN(tokenId) && !isNaN(initialSupply) && !isNaN(offchainPoints)) {
            await mintDiscountNFT(tokenId, initialSupply, offchainPoints); 
            console.log(`Successfully minted NFT with ID ${tokenId}, points required ${offchainPoints}, and initial supply ${initialSupply}`);

            setTokenIdInput('');
            setInitialSupplyInput('');
            setPointsInput('');
        } else {
            console.error('Invalid token ID, initial supply, or off-chain points');
        }
    } catch (error) {
        console.error('Error minting NFT:', error);
    }
};


  return (
    <div className="admin-wrapper">
      <h2>Admin Page</h2>
      <div>
       <h3>Mint discount NFT</h3>
      <div>
          Enter Token ID:
           <input
             type="text"
             value={tokenIdInput}
             onChange={(e) => setTokenIdInput(e.target.value)}
           />
         </div>
         <div>
           Enter amount of points needed:
           <input
             type="text"
             value={pointsInput}
             onChange={(e) => setPointsInput(e.target.value)}
           />
         </div>
         <div>
           Enter Initial Supply:
           <input
             type="text"
             value={initialSupplyInput}
             onChange={(e) => setInitialSupplyInput(e.target.value)}
           />
         </div>
         <button onClick={handleMintNFT}>Mint NFT</button>
       </div>
      <div>
     <h3>Mint performance NFT</h3>
        <input type="text" value={artistAddress} onChange={(e) => setArtistAddress(e.target.value)} placeholder="Artist Address" />
         <button onClick={handleCreateNFT}>Create NFT</button>
    </div>

      <div>
        <h3>Fractionalize NFT</h3>
        <input type="number" value={totalShares} onChange={(e) => setTotalShares(e.target.value)} placeholder="Total Shares" />
        <button onClick={handleFractionalizeNFT}>Fractionalize NFT</button>
      </div>

      <div>
        <h3>Set Attendee</h3>
        <input type="text" value={attendeeAddress} onChange={(e) => setAttendeeAddress(e.target.value)} placeholder="Attendee Address" />
        <button onClick={handleSetAttendee}>Set Attendee</button>
      </div>

      <div>
        <h3>Airdrop NFT Shares</h3>
        <input type="text" value={attendeeAddress} onChange={(e) => setAttendeeAddress(e.target.value)} placeholder="Attendee Address" />
        <button onClick={handleAirdropNFTShares}>Airdrop NFT Shares</button>
      </div>
    </div>
  );
};

export default Admin;
