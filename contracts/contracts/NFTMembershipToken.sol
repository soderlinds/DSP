// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract NFTMembershipToken is ERC1155, Ownable {
    uint256 private nextTokenId = 0; // Tracking the ID for the next token to be minted, assigned value 0 to make it more clear

    event NFTMinted(address indexed owner, uint256 indexed tokenId, string metadataURI); // Event emitted when an NFT is minted

    constructor() ERC1155("NFT Membership Token") {} // Initializing the contract with the name "NFT Membership Token"

    function mint(string memory _metadataURI) external { // Minting a new NFT
        require(!hasMintedNFT(msg.sender), "User already owns an NFT"); // Ensuring user hasn't already minted an NFT
        _mint(msg.sender, nextTokenId, 1, ""); // Minting the new NFT and assigning to the user
        emit NFTMinted(msg.sender, nextTokenId, _metadataURI); // Emit NFTMinted event
        nextTokenId++; // Increasing token ID for next minted token
    }

    function hasMintedNFT(address _owner) public view returns (bool) { // Function to check if user has minted an NFT
      return balanceOf(_owner, 0) > 0; // Checking if the user already has a NFT

    }

    function uri(uint256 _id) public view override returns (string memory) { // Overriding uri function to return metadata URI (had this since before as a start for having dynamic metadata). Maybe change to off-chain storage?
        require(_id < nextTokenId, "Token ID does not exist"); // Ensuring that token ID exists
        return string(abi.encodePacked(super.uri(0), _id)); // Combines base URI with token ID to form complete unique URI
    }
}

