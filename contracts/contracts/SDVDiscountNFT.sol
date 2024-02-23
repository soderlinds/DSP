// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

contract SDVDiscountNFT is ERC1155, Ownable {
    using Strings for uint256;

    mapping(uint256 => uint256) public nftPrice;
    mapping(uint256 => bool) private tokenExists;

    constructor(string memory baseTokenURI) ERC1155(baseTokenURI) {}

    function mint(uint256 tokenId, uint256 _nftPrice, uint256 initialSupply) external onlyOwner {
        require(!tokenExists[tokenId], "Token ID already exists");

        _mint(owner(), tokenId, initialSupply, "");

        setNFTPrice(tokenId, _nftPrice);
        tokenExists[tokenId] = true;
    }

    function purchaseNFTWithPoints(uint256 tokenId, uint256 amount, uint256 offchainPoints) external {
        require(tokenExists[tokenId], "Token ID does not exist");
        uint256 price = getNFTPrice(tokenId) * amount;
        require(offchainPoints >= price, "Insufficient off-chain points");
        safeTransferFrom(owner(), msg.sender, tokenId, amount, "");
    }

    function getNFTPrice(uint256 tokenId) public view returns (uint256) {
        require(tokenExists[tokenId], "Token ID does not exist");
        return nftPrice[tokenId];
    }

    function setNFTPrice(uint256 tokenId, uint256 newNFTPrice) public onlyOwner {
        require(tokenExists[tokenId], "Token ID does not exist");
        nftPrice[tokenId] = newNFTPrice;
    }

    function tokenURI(uint256 tokenId) public view returns (string memory) {
        require(tokenExists[tokenId], "Token ID does not exist");
        return string(abi.encodePacked(uri(tokenId), tokenId.toString(), ".json"));
    }
}
