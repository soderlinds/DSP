// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

contract SDVDiscountNFT is ERC1155, Ownable {
    using Strings for uint256;

    mapping(uint256 => uint256) private nftPrice;
    mapping(uint256 => bool) private tokenExists;
    uint256[] private mintedNFTs;

    constructor(string memory baseTokenURI) ERC1155(baseTokenURI) {}

    function mint(uint256 tokenId, uint256 initialSupply, uint256 _nftPrice) external onlyOwner {
        require(!tokenExists[tokenId], "Token ID already exists");

        _mint(owner(), tokenId, initialSupply, "");

        nftPrice[tokenId] = _nftPrice;
        tokenExists[tokenId] = true;
        mintedNFTs.push(tokenId); 
    }

    function getAllMintedNFTs() external view returns (uint256[] memory) {
        return mintedNFTs;
    }

    function purchaseNFTWithPoints(uint256 tokenId, uint256 amount, uint256 offchainPoints) external {
        require(tokenExists[tokenId], "Token ID does not exist");
        uint256 price = nftPrice[tokenId] * amount;
        require(offchainPoints >= price, "Insufficient off-chain points");
        safeTransferFrom(owner(), msg.sender, tokenId, amount, "");
    }

    function tokenURI(uint256 tokenId) public view returns (string memory) {
        require(tokenExists[tokenId], "Token ID does not exist");
        return string(abi.encodePacked(uri(tokenId), tokenId.toString(), ".json"));
    }

    function getNFTPrice(uint256 tokenId) external view returns (uint256) {
    require(tokenExists[tokenId], "Token ID does not exist");
    return nftPrice[tokenId];
    }
}
