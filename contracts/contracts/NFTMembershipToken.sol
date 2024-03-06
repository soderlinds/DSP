// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract NFTMembershipToken is ERC1155, Ownable {
    uint256 private nextTokenId = 0;
    bool private hasMinted;

    event NFTMinted(address indexed owner, uint256 indexed tokenId, string metadataURI);

    constructor() ERC1155("NFT Membership Token URI") {}

    function mint(string memory _metadataURI) external {
        require(!hasMinted, "Already minted");
        _mint(msg.sender, nextTokenId, 1, "");
        emit NFTMinted(msg.sender, nextTokenId, _metadataURI);
        hasMinted = true;
        nextTokenId++;
    }

    function uri(uint256 _id) public view override returns (string memory) {
        require(_id < nextTokenId, "Token ID does not exist");
        return string(abi.encodePacked(super.uri(0), _id));
    }
}
