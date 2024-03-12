// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract SDVToken is ERC20, Ownable {
    uint256 public constant TOTAL_SUPPLY = 100_000;

    event TokensAirdropped(address indexed user, uint256 amount);

    event PointsExchanged(address indexed user, uint256 points, uint256 tokens);

    constructor() ERC20("SDVToken", "SDV") {
        _mint(msg.sender, TOTAL_SUPPLY);
    }

    function airdropTokens(address[] memory _users, uint256[] memory _amounts) external onlyOwner {
        require(_users.length == _amounts.length, "Invalid input lengths");

        for (uint256 i = 0; i < _users.length; i++) {
            _transfer(owner(), _users[i], _amounts[i]);
            emit TokensAirdropped(_users[i], _amounts[i]);
        }
    }

    function exchangePointsForTokens(uint256 _pointsToExchange) external {
        uint256 tokenAmount = _pointsToExchange / 1000; 
        _mint(msg.sender, tokenAmount);

        emit PointsExchanged(msg.sender, _pointsToExchange, tokenAmount);
    }
}
