// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

contract SDVDiscountNFT is ERC1155, Ownable {
    using Strings for uint256;

    mapping(uint256 => bool) private tokenExists;

    event NFTMinted(uint256 indexed tokenId, uint256 price);

    constructor(string memory baseTokenURI) ERC1155(baseTokenURI) {}

    function mint(uint256 tokenId, uint256 initialSupply, uint256 price) external onlyOwner {
        require(!tokenExists[tokenId], "Token ID already exists");

        _mint(owner(), tokenId, initialSupply, "");

        tokenExists[tokenId] = true;
        emit NFTMinted(tokenId, price);
    }

    function purchaseNFTWithPoints(uint256 tokenId, uint256 amount, uint256 offchainPoints, uint256 price) external {
        require(tokenExists[tokenId], "Token ID does not exist");
        require(offchainPoints >= price * amount, "Insufficient off-chain points");
        safeTransferFrom(owner(), msg.sender, tokenId, amount, "");
    }

    function tokenURI(uint256 tokenId) public view returns (string memory) {
        require(tokenExists[tokenId], "Token ID does not exist");
        return string(abi.encodePacked(uri(tokenId), tokenId.toString(), ".json"));
    }
}
