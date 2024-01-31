// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

contract SDVDiscountNFT is ERC721, Ownable {
    using Strings for uint256;

    IERC20 public SDVToken;
    string private _baseTokenURI;

    uint256 public ticketPrice;
    uint256[] private mintedTokens;

    constructor(address _SDVToken, string memory baseTokenURI, uint256 _ticketPrice) ERC721("SDVNFT", "SDVN") {
        SDVToken = IERC20(_SDVToken);
        _baseTokenURI = baseTokenURI;
        ticketPrice = _ticketPrice;
    }

    function setBaseTokenURI(string memory baseTokenURI) external onlyOwner {
        _baseTokenURI = baseTokenURI;
    }

    function mint(uint256 tokenId) external onlyOwner {
        require(!_exists(tokenId), "Token ID already exists");

        _safeMint(owner(), tokenId);
        mintedTokens.push(tokenId);
    }

    function purchaseNFT(uint256 tokenId) external {
        require(_exists(tokenId), "Token ID does not exist");
        require(ownerOf(tokenId) == owner(), "NFT not available for purchase");

        SDVToken.transferFrom(msg.sender, owner(), ticketPrice);

        _transfer(owner(), msg.sender, tokenId);
    }

    function tokenURI(uint256 tokenId) public view override returns (string memory) {
        require(_exists(tokenId), "Token ID does not exist");
        return string(abi.encodePacked(_baseTokenURI, tokenId.toString(), ".json"));
    }

    function getAllMintedNFTs() external view returns (uint256[] memory) {
        return mintedTokens;
    }
}
