// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

contract SDVDiscountNFT is ERC721URIStorage, Ownable {
    using Strings for uint256;

    IERC20 public SDVToken;
    string private _baseTokenURI;

    uint256[] private mintedTokens;
    mapping(uint256 => uint256) public nftPrice;

    constructor(address _SDVToken, string memory baseTokenURI) ERC721("SDVNFT", "SDVN") {
        SDVToken = IERC20(_SDVToken);
        _baseTokenURI = baseTokenURI;
    }

    function setBaseTokenURI(string memory baseTokenURI) external onlyOwner {
        _baseTokenURI = baseTokenURI;
    }

    function mint(uint256 tokenId, uint256 _nftPrice) external onlyOwner {
        require(!_exists(tokenId), "Token ID already exists");

        _safeMint(owner(), tokenId);
        mintedTokens.push(tokenId);

        setNFTPrice(tokenId, _nftPrice);

        _setTokenURI(tokenId, string(abi.encodePacked(_baseTokenURI, tokenId.toString(), ".json")));
    }

    function purchaseNFT(uint256 tokenId) external {
        require(_exists(tokenId), "Token ID does not exist");

        uint256 price = getNFTPrice(tokenId);

        SDVToken.transferFrom(msg.sender, owner(), price);

        _transfer(owner(), msg.sender, tokenId);
    }

    function getNFTPrice(uint256 tokenId) public view returns (uint256) {
        require(_exists(tokenId), "Token ID does not exist");
        return nftPrice[tokenId];
    }

    function setNFTPrice(uint256 tokenId, uint256 newNFTPrice) public onlyOwner {
        require(_exists(tokenId), "Token ID does not exist");
        nftPrice[tokenId] = newNFTPrice;
    }

    function tokenURI(uint256 tokenId) public view override(ERC721URIStorage) returns (string memory) {
        require(_exists(tokenId), "Token ID does not exist");
        return ERC721URIStorage.tokenURI(tokenId);
    }

    function getAllMintedNFTs() external view returns (uint256[] memory) {
        return mintedTokens;
    }
}
