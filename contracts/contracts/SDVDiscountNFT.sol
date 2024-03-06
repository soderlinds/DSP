// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

contract SDVDiscountNFT is ERC1155, Ownable {
    using Strings for uint256;

    uint256 private nextTokenId = 10000; 

    event NFTMinted(uint256 indexed tokenId, uint256 price);
    event NFTPurchased(address indexed buyer, uint256 indexed tokenId, uint256 amount, uint256 price);

    constructor(string memory baseTokenURI) ERC1155(baseTokenURI) {}

    function mint(uint256 initialSupply, uint256 price) external onlyOwner {
        uint256 tokenId = nextTokenId++;
        _mint(owner(), tokenId, initialSupply, "");

        emit NFTMinted(tokenId, price);
    }

    function purchaseNFTWithPoints(uint256 tokenId, uint256 amount, uint256 offchainPoints, uint256 price) external {
        require(tokenId < nextTokenId, "Token ID does not exist");
        require(offchainPoints >= price * amount, "Insufficient off-chain points");
        safeTransferFrom(owner(), msg.sender, tokenId, amount, "");

        emit NFTPurchased(msg.sender, tokenId, amount, price);
    }

    function tokenURI(uint256 tokenId) external view returns (string memory) {
        require(tokenId < nextTokenId, "Token ID does not exist");
        return string(abi.encodePacked(uri(tokenId), tokenId.toString(), ".json"));
    }
}

