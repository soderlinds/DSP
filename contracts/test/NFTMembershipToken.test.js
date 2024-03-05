// Instead of using require, use dynamic import
const { expect } = require('chai');

// Import contract artifacts
const NFTMembershipToken = artifacts.require('NFTMembershipToken');

// Start a test suite
contract('NFTMembershipToken', (accounts) => {
    let tokenInstance;

    // Deploy a new contract instance before each test
    beforeEach(async () => {
        tokenInstance = await NFTMembershipToken.new();
    });

    // Test case for minting tokens
    it('Should mint new tokens', async () => {
        const metadataURI = 'example-metadata-uri';
        await tokenInstance.mint(metadataURI, { from: accounts[0] });
        const balance = await tokenInstance.balanceOf(accounts[0], 0);
        expect(balance.toNumber()).to.equal(1);

        // Check URI of the minted token
        const tokenURI = await tokenInstance.uri(0);
        expect(tokenURI).to.equal("NFT Membership Token URI0");
    });

    // Test case for preventing double minting
    it('Should prevent double minting', async () => {
        const metadataURI = 'example-metadata-uri';
        await tokenInstance.mint(metadataURI, { from: accounts[0] });
        // Attempting to mint the same token again should fail
        await expect(tokenInstance.mint(metadataURI, { from: accounts[0] })).to.be.revertedWith('Already minted');
    });
});
