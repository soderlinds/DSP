// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract NFTMembershipToken is ERC1155, Ownable {
    mapping(address => bool) private hasMinted;
    mapping(uint256 => string) private tokenMetadataURIs;
    uint256 private nextTokenId;
    mapping(address => uint256[]) private userNFTs;

    constructor() ERC1155("NFT Membership Token URI") {}

    function mint(string memory _metadataURI) external {
        require(!hasMinted[msg.sender], "Already minted");
        _mint(msg.sender, nextTokenId, 1, "");
        tokenMetadataURIs[nextTokenId] = _metadataURI;
        userNFTs[msg.sender].push(nextTokenId);
        hasMinted[msg.sender] = true;
        nextTokenId++;
    }

    function getUserNFTs(address _user) external view returns (uint256[] memory) {
        return userNFTs[_user];
    }

    function uri(uint256 _id) public view override returns (string memory) {
        return tokenMetadataURIs[_id];
    }
}
