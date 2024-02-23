// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract NFTMembershipToken is ERC721, Ownable {
    uint256 private nextTokenId;
    mapping(address => bool) private isMember; 
    mapping(address => uint256[]) private userNFTs; 
    mapping(uint256 => string) private tokenMetadataURIs;

    constructor() ERC721("NFT Membership Token", "NMT") {}

    function mint(string memory _metadataURI) external {
        require(!isMember[msg.sender], "Already a member"); 
        _safeMint(msg.sender, nextTokenId);
        userNFTs[msg.sender].push(nextTokenId); 
        tokenMetadataURIs[nextTokenId] = _metadataURI;
        isMember[msg.sender] = true; 
        nextTokenId++;
    }

    function getUserNFTs(address _user) external view returns (uint256[] memory) {
        return userNFTs[_user];
    }

    // function getTokenMetadataURI(uint256 _tokenId) external view returns (string memory) {
    //     require(_exists(_tokenId), "Token does not exist");
    //     return tokenMetadataURIs[_tokenId];
    // }
}
