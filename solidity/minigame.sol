pragma solidity ^0.8.4;

contract MiniGame {
    // declare variable
    uint256 public userCount;
    uint256 public userWinner100Count;
    uint256 public userWinner50Count;

    address owner = msg.sender;
    // open only 7 days (25/08/2021).
    uint256 openTime = 1629882000;
    mapping(uint256 => User) public users;
    mapping(uint256 => User) public usersWinner100;
    mapping(uint256 => User) public usersWinner50;

    // validate address
    mapping(address => bool) addressUser;
    mapping(address => bool) addressUser100;
    mapping(address => bool) addressUser50;

    // struct
    struct User {
        uint256 key;
        string _ID;
        address _VI;
        bool _isSet;
    }
    // modifier
    modifier onlyOwner() {
        require(msg.sender == owner, "You are not owner");
        _;
    }
    modifier onlyWhileOpen() {
        require(block.timestamp <= openTime, "Expired registration");
        _;
    }

    // main function
    function setOpenTime(uint256 _openTime) public onlyOwner {
        openTime = _openTime;
    }

    function register(string memory _id) public onlyWhileOpen {
        require(!addressUser[msg.sender], "One account only one address");
        userCount += 1;
        users[userCount] = User(userCount, _id, msg.sender, true);
        addressUser[msg.sender] = true;
        emit broadcastUser(msg.sender, _id);
    }

    function randUserWin(uint256 _option, uint256 _numRand) public onlyOwner {
        require(_option == 50 || _option == 100, "Option must be 50 or 100");
        require(users[_numRand]._isSet, "User is not registered");
        require(
            !addressUser50[users[_numRand]._VI],
            "This account has already won a prize (50)"
        );
        require(
            !addressUser100[users[_numRand]._VI],
            "This account has already won a prize (100)"
        );
        if (_option == 50) {
            userWinner50Count += 1;
            usersWinner50[userWinner50Count] = users[_numRand];
            addressUser50[users[_numRand]._VI] = true;
            emit broadcastusersWinner50(
                users[_numRand]._VI,
                users[_numRand]._ID
            );
        } else if (_option == 100) {
            userWinner100Count += 1;
            usersWinner100[userWinner100Count] = users[_numRand];
            addressUser100[users[_numRand]._VI] = true;
            emit broadcastusersWinner100(
                users[_numRand]._VI,
                users[_numRand]._ID
            );
        }
    }

    // event
    event broadcastUser(address _adr, string _id);
    event broadcastusersWinner50(address _adr, string _id);
    event broadcastusersWinner100(address _adr, string _id);
}
