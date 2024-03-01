import React from 'react';

const Web2LoggedInSection = ({ username, tokenBalance }) => (
  <div>
    <p>Welcome, {username}</p>
    <p>Logged in (Web2)</p>
    <p>Your points balance: {tokenBalance}</p>
  </div>
);

const Web3LoggedInSection = ({ account, tokenBalance, nftImages }) => (
  <div>
    <p>Welcome, {account}</p>
    <p>Your token balance: {tokenBalance}</p>
    {nftImages && nftImages.length > 0 && (
      <div>
        {nftImages.map((imageUrl, index) => (
          <img key={index} src={imageUrl} alt={`NFT ${index}`} />
        ))}
      </div>
    )}
  </div>
);

const LoggedInSection = ({ username, account, tokenBalance, nftImages, isWeb2 }) => {
  console.log("isWeb2:", isWeb2);
  return (
    <div>
      {isWeb2 ? (
        <Web2LoggedInSection username={username} tokenBalance={tokenBalance} />
      ) : (
        <Web3LoggedInSection account={account} tokenBalance={tokenBalance} nftImages={nftImages} />
      )}
    </div>
  );
};

export default LoggedInSection;
