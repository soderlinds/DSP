import React, { useState } from 'react';
import { useSmartContract } from '../SmartContractContext';

const AdminPage = () => {
  const { createNFT, fractionalizeNFT, setAttendee, airdropNFTShares } = useSmartContract();
  const [artistAddress, setArtistAddress] = useState('');
  const [totalShares, setTotalShares] = useState(0);
  const [attendeeAddress, setAttendeeAddress] = useState('');


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

  return (
    <div>
      <h2>Admin Page</h2>

      <div>
     <h3>Create NFT</h3>
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

export default AdminPage;
