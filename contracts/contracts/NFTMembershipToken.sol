// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract NFTMembershipToken is ERC1155, Ownable {
    uint256 private nextTokenId = 0;

    event NFTMinted(address indexed owner, uint256 indexed tokenId, string metadataURI);

    constructor() ERC1155("NFT Membership Token") {} //Should this just be a string instead, string public baseURI = "";?

    function mint(string memory _metadataURI) external {
        require(balanceOf(msg.sender, nextTokenId) == 0, "User has already minted an NFT");
        emit NFTMinted(msg.sender, nextTokenId, _metadataURI);
        nextTokenId++;
        _mint(msg.sender, nextTokenId, 1, "");
    }

    function uri(uint256 _id) public view override returns (string memory) { //maybe change to off-chain storage?
        require(_id < nextTokenId, "Token ID does not exist");
        return string(abi.encodePacked(super.uri(0), _id));
    }
}

