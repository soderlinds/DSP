// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract SDVToken is ERC20, Ownable {
    struct Member {
        string email;
        uint256 tokens;
        uint256 points;
        bool registered;
    }

    mapping(address => Member) public members;

    event UserRegistered(address indexed user, string email);
    event TokensAirdropped(address indexed user, uint256 amount);
    event MerchandisePurchased(address indexed user, uint256 amount);
    event TokensApproved(address indexed owner, address indexed spender, uint256 amount);
    event PointsEarned(address indexed user, uint256 amount);
    event PointsExchanged(address indexed user, uint256 points, uint256 tokens);

    constructor() ERC20("SDVToken", "SDV") {
        _mint(msg.sender, 1000000 * 10**decimals());
    }

    function registerUser(string memory _email) external {
        require(!members[msg.sender].registered, "User already registered");
        require(bytes(_email).length > 0, "Email cannot be empty");

        members[msg.sender].email = _email;
        members[msg.sender].registered = true;

        emit UserRegistered(msg.sender, _email);
    }

    function airdropTokens(address[] memory _users, uint256[] memory _amounts) external onlyOwner {
        require(_users.length == _amounts.length, "Invalid input lengths");

        for (uint256 i = 0; i < _users.length; i++) {
            require(members[_users[i]].registered, "User not registered");

            _transfer(owner(), _users[i], _amounts[i]);
            members[_users[i]].tokens += _amounts[i];

            emit TokensAirdropped(_users[i], _amounts[i]);
        }
    }

    function purchaseMerchandise(uint256 _amount) external {
        require(members[msg.sender].registered, "User not registered");
        require(members[msg.sender].tokens >= _amount, "Insufficient funds");

        _transfer(msg.sender, owner(), _amount);
        members[msg.sender].tokens -= _amount;

        emit MerchandisePurchased(msg.sender, _amount);
    }

    function earnPoints(uint256 _amount) external {
        require(members[msg.sender].registered, "User not registered");
        members[msg.sender].points += _amount;

        emit PointsEarned(msg.sender, _amount);
    }

    function exchangePointsForTokens(uint256 _pointsToExchange) external {
        require(members[msg.sender].registered, "User not registered");
        require(members[msg.sender].points >= _pointsToExchange, "Insufficient points");

        uint256 tokenAmount = _pointsToExchange;
        _mint(msg.sender, tokenAmount);
        members[msg.sender].tokens += tokenAmount;
        members[msg.sender].points -= _pointsToExchange;

        emit Transfer(address(0), msg.sender, tokenAmount);
        emit PointsExchanged(msg.sender, _pointsToExchange, tokenAmount);
    }

    function approve(address spender, uint256 amount) public override returns (bool) {
        _approve(_msgSender(), spender, amount);
        emit Approval(_msgSender(), spender, amount);
        return true;
    }

    function getPointsBalance(address user) external view returns (uint256) {
        return members[user].points;
    }
}