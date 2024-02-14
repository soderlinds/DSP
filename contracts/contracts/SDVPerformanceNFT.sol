// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract SDVPerformanceNFT is ERC1155, Ownable {
    uint256 public constant MAX_FRACTIONAL_SHARES = 300;

    struct NFT {
        uint256 totalShares;
        uint256 remainingShares;
        address artist;
    }

    mapping(uint256 => NFT) public nfts;
    mapping(uint256 => mapping(address => uint256)) public fractionalOwnership;
    mapping(address => bool) public attendees;

    event NFTCreated(uint256 indexed tokenId, address indexed artist);
    event TokensFractionalized(uint256 indexed tokenId, uint256 totalShares);
    event TokensMinted(uint256 indexed tokenId, address indexed to, uint256 amount);
    event NFTSharesAirdropped(uint256 indexed tokenId, address[] participants, uint256[] amounts);
    
    constructor() ERC1155("file:///public/metadata/{id}.json") {}


    function createNFT(address _artist) external onlyOwner returns (uint256 tokenId) {
        require(nfts[0].totalShares == 0, "NFT has already been created");
        tokenId = 0;
        nfts[tokenId] = NFT(0, 0, _artist);
        emit NFTCreated(tokenId, _artist);
    }

    function fractionalizeNFT(uint256 _totalShares) external onlyOwner {
        require(nfts[0].totalShares == 0, "NFT has already been fractionalized");
        require(_totalShares <= MAX_FRACTIONAL_SHARES, "Exceeds maximum fractional shares");

        nfts[0].totalShares = _totalShares;
        nfts[0].remainingShares = _totalShares;
        emit TokensFractionalized(0, _totalShares);
    }

    function mint(address _to, uint256 _amount) external {
        require(attendees[msg.sender], "Only attendees of the show can mint tokens");
        require(fractionalOwnership[0][_to] == 0, "You already own a fraction of this token");
        require(_amount <= nfts[0].remainingShares, "Exceeds remaining shares");
        _mint(_to, 0, _amount, "");
        fractionalOwnership[0][_to] += _amount;
        nfts[0].remainingShares -= _amount;
        emit TokensMinted(0, _to, _amount);
    }

    function setAttendee(address _attendee) external onlyOwner {
        attendees[_attendee] = true;
    }

    function airdropNFTShares(address[] memory _participants) external onlyOwner {
        require(_participants.length > 0, "No participants specified");

        uint256 totalSharesToAirdrop = _participants.length;

        require(totalSharesToAirdrop <= nfts[0].remainingShares, "Exceeds remaining shares");

        for (uint256 i = 0; i < _participants.length; i++) {
            address participant = _participants[i];
            _mint(participant, 0, 1, ""); 
            fractionalOwnership[0][participant] += 1;
            nfts[0].remainingShares -= 1;
        }

        emit NFTSharesAirdropped(0, _participants, new uint256[](_participants.length)); 
    }


    function getOwnedNFTs(address account) external view returns (uint256[] memory) {
        if (fractionalOwnership[0][account] > 0) {
            uint256[] memory ownedNFTs = new uint256[](1);
            ownedNFTs[0] = 0;
            return ownedNFTs;
        } else {
            return new uint256[](0);
        }
    }
}
