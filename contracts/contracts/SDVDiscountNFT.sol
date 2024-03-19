// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

contract SDVDiscountNFT is ERC1155, Ownable {
    using Strings for uint256;

    struct NFT {
        uint256 initialSupply; //change to smaller uint?
        uint256 offchainPoints; //change to smaller uint?
        uint256 remainingAmount; //change to smaller uint?
    } 

    mapping(uint256 => NFT) public nfts;

    uint256 private nextTokenId = 1; 

    event NFTMinted(uint256 indexed tokenId, uint256 initialSupply, uint256 offchainPoints); 
    event NFTPurchased(address indexed buyer, uint256 indexed tokenId, uint256 amount); 

    string public baseURI; 

    constructor(string memory _baseURI) ERC1155("") { //Should I just have string public baseURI = "";  instead?
        baseURI = _baseURI; 
    }

    function mint(uint256 initialSupply, uint256 offchainPoints) external onlyOwner {
        uint256 tokenId = nextTokenId++;
        nfts[tokenId] = NFT(initialSupply, offchainPoints, initialSupply);
        emit NFTMinted(tokenId, initialSupply, offchainPoints);
        _mint(owner(), tokenId, initialSupply, "");
    }

    function purchaseNFTWithPoints(uint256 tokenId, uint256 amount) external {
        require(tokenId < nextTokenId, "Token ID does not exist");
        require(amount <= nfts[tokenId].remainingAmount, "Exceeds remaining amount");
        require(amount > 0, "Invalid amount");

        emit NFTPurchased(msg.sender, tokenId, amount);

        nfts[tokenId].remainingAmount -= amount;
        _mint(msg.sender, tokenId, amount, ""); // had safeTransferFrom here before, but could not have anyone else but owner claim the NFT then
    }

    function uri(uint256 tokenId) public view override returns (string memory) {
        require(tokenId < nextTokenId, "Token ID does not exist");
        return string(abi.encodePacked(baseURI, tokenId.toString(), ".json"));
    }

}
