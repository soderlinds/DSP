import React, { useState } from 'react';
import { useExperimentalFarcasterSigner, usePrivy } from '@privy-io/react-auth';

function Farcaster() {
  const { user } = usePrivy();
  const { requestFarcasterSigner, submitCast, likeCast, recastCast, followUser, unfollowUser } = useExperimentalFarcasterSigner();
  
  const farcasterAccount = user.linkedAccounts.find((account) => account.type === 'farcaster');
  const [message, setMessage] = useState('');

  const handleAuthorizeSigner = async () => {
    try {
      await requestFarcasterSigner();
    } catch (error) {
      console.error('Error authorizing Farcaster signer:', error);
    }
  };

  const handleCreateCast = async () => {
    try {
      const { hash } = await submitCast({ text: message });
      console.log('Cast submitted with hash:', hash);
    } catch (error) {
      console.error('Error submitting cast:', error);
    }
  };

  const handleLikeCast = async (castHash, castAuthorFid) => {
    try {
      const { hash: likeMessageHash } = await likeCast({ castHash, castAuthorFid });
      console.log('Cast liked with hash:', likeMessageHash);
    } catch (error) {
      console.error('Error liking cast:', error);
    }
  };

  const handleRecastCast = async (castHash, castAuthorFid) => {
    try {
      const { hash: recastMessageHash } = await recastCast({ castHash, castAuthorFid });
      console.log('Cast recasted with hash:', recastMessageHash);
    } catch (error) {
      console.error('Error recasting cast:', error);
    }
  };

  const handleFollowUser = async (fid) => {
    try {
      const { hash } = await followUser({ fid });
      console.log('User followed with hash:', hash);
    } catch (error) {
      console.error('Error following user:', error);
    }
  };

  const handleUnfollowUser = async (fid) => {
    try {
      const { hash } = await unfollowUser({ fid });
      console.log('User unfollowed with hash:', hash);
    } catch (error) {
      console.error('Error unfollowing user:', error);
    }
  };

  return (
    <div className="wrapper">
      <button onClick={handleAuthorizeSigner} disabled={!farcasterAccount || farcasterAccount.signerPublicKey}>
        Authorize my Farcaster signer
      </button>

      <div>
        <input type="text" value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Enter your message" />
        <button onClick={handleCreateCast}>Submit Cast</button>
      </div>

      <button onClick={() => handleFollowUser(403016)}>Follow Sara</button>
      <button onClick={() => handleLikeCast('0x3e9b3734a29ad341f1c73912c42343a21d5df75a', 403016)}>Like Sara's Cast</button>
      <button onClick={() => handleRecastCast('0x6be44f32011a59e239d5a00bb6302c3105ad3214', 403016)}>Recast Sara's Cast</button>
      <button onClick={() => handleUnfollowUser(403016)}>Unfollow Sara</button>
    </div>
  );
}

export default Farcaster;

