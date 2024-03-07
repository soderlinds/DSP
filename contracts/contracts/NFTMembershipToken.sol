// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract NFTMembershipToken is ERC1155, Ownable {
    uint256 private nextTokenId = 0;

    event NFTMinted(address indexed owner, uint256 indexed tokenId, string metadataURI); 

    constructor() ERC1155("NFT Membership Token") {}

    function mint(string memory _metadataURI) external {
        require(!hasMintedNFT(msg.sender), "User already owns an NFT"); 
        _mint(msg.sender, nextTokenId, 1, "");
        emit NFTMinted(msg.sender, nextTokenId, _metadataURI);

        nextTokenId++;
    }

     function hasMintedNFT(address _owner) public view returns (bool) {
        return balanceOf(_owner, 0) > 0; 
    }

    function uri(uint256 _id) public view override returns (string memory) {
        require(_id < nextTokenId, "Token ID does not exist");
        return string(abi.encodePacked(super.uri(0), _id));
    }
}