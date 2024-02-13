// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract SDVToken is ERC20, Ownable {
    enum Status { Normal, Silver, Gold }
    
    struct Member {
        string email;
        uint256 tokens;
        uint256 points;
        Status status;
        bool registered;
    }
    
    mapping(address => Member) public members;
    address[] public registeredUsers;

    event StatusUpdated(address indexed user, Status status);
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
        registeredUsers.push(msg.sender);

        _updateStatus(msg.sender);

        emit UserRegistered(msg.sender, _email);
        emit StatusUpdated(msg.sender, members[msg.sender].status);
    }

    function _updateStatus(address _user) internal {
        uint256 tokenBalance = balanceOf(_user);

        if (tokenBalance >= 5000 * 10**decimals()) {
            members[_user].status = Status.Gold;
        } else if (tokenBalance >= 2000 * 10**decimals()) {
            members[_user].status = Status.Silver;
        } else {
            members[_user].status = Status.Normal;
        }

        emit StatusUpdated(_user, members[_user].status);
    }

    function getStatus(address _user) external view returns (Status) {
        return members[_user].status;
    }

    function getAllUsers() external view returns (address[] memory, Status[] memory) {
        uint256 userCount = registeredUsers.length;
        address[] memory users = new address[](userCount);
        Status[] memory statuses = new Status[](userCount);

        for (uint256 i = 0; i < userCount; i++) {
            address user = registeredUsers[i];
            users[i] = user;
            statuses[i] = members[user].status;
        }

        return (users, statuses);
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