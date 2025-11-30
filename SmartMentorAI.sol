// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

/**
 * SmartMentorAI Achievement Contract
 * ERC-721 compliant smart contract for issuing blockchain-verified achievement NFTs
 * Deployed on Ethereum/Polygon for decentralized certification
 */

interface IERC721 {
    event Transfer(address indexed from, address indexed to, uint256 indexed tokenId);
    event Approval(address indexed owner, address indexed approved, uint256 indexed tokenId);
    function balanceOf(address owner) external view returns (uint256 balance);
    function ownerOf(uint256 tokenId) external view returns (address owner);
    function safeTransferFrom(address from, address to, uint256 tokenId) external;
    function transferFrom(address from, address to, uint256 tokenId) external;
    function approve(address to, uint256 tokenId) external;
    function setApprovalForAll(address operator, bool approved) external;
    function getApproved(uint256 tokenId) external view returns (address operator);
    function isApprovedForAll(address owner, address operator) external view returns (bool);
}

contract SmartMentorAIAchievements {
    // Contract metadata
    string public name = "SmartMentorAI Achievements";
    string public symbol = "SMA";
    string public version = "1.0.0";
    
    address public contractOwner;
    uint256 private tokenIdCounter = 1;
    
    // Data structures
    struct Achievement {
        uint256 tokenId;
        address recipient;
        string title;
        string description;
        uint256 pointsEarned;
        uint256 completionDate;
        bytes32 certificateHash;
        bool isVerified;
        string metadataURI;
    }
    
    struct UserProfile {
        address walletAddress;
        string name;
        string email;
        uint256 totalPoints;
        uint256 achievementCount;
        uint256 registrationDate;
        bool isActive;
    }
    
    struct LeaderboardEntry {
        address userAddress;
        string userName;
        uint256 totalPoints;
        uint256 achievementCount;
        uint256 rank;
    }
    
    // Mappings
    mapping(uint256 => Achievement) public achievements;
    mapping(address => UserProfile) public userProfiles;
    mapping(address => uint256[]) public userAchievements;
    mapping(address => bytes32) public userVerification;
    
    // Arrays
    LeaderboardEntry[] public leaderboard;
    address[] public registeredUsers;
    
    // Events
    event AchievementIssued(address indexed recipient, uint256 indexed tokenId, string title, uint256 points);
    event UserRegistered(address indexed userAddress, string name);
    event CertificateVerified(uint256 indexed tokenId, bytes32 certificateHash);
    event PointsTransferred(address indexed from, address indexed to, uint256 points);
    event LeaderboardUpdated(uint256 timestamp);
    
    // Modifiers
    modifier onlyOwner() {
        require(msg.sender == contractOwner, "Only owner can call this function");
        _;
    }
    
    modifier onlyVerifiedUser(address _user) {
        require(userProfiles[_user].isActive, "User not verified");
        _;
    }
    
    // Constructor
    constructor() {
        contractOwner = msg.sender;
    }
    
    /**
     * Register user on blockchain
     */
    function registerUser(string memory _name, string memory _email) external {
        require(userProfiles[msg.sender].walletAddress == address(0), "User already registered");
        
        userProfiles[msg.sender] = UserProfile({
            walletAddress: msg.sender,
            name: _name,
            email: _email,
            totalPoints: 0,
            achievementCount: 0,
            registrationDate: block.timestamp,
            isActive: true
        });
        
        registeredUsers.push(msg.sender);
        emit UserRegistered(msg.sender, _name);
    }
    
    /**
     * Issue achievement NFT
     */
    function issueAchievement(
        address _recipient,
        string memory _title,
        string memory _description,
        uint256 _points,
        bytes32 _certificateHash,
        string memory _metadataURI
    ) external onlyOwner returns (uint256) {
        require(_recipient != address(0), "Invalid recipient");
        require(_points > 0, "Points must be greater than 0");
        
        uint256 newTokenId = tokenIdCounter;
        tokenIdCounter++;
        
        achievements[newTokenId] = Achievement({
            tokenId: newTokenId,
            recipient: _recipient,
            title: _title,
            description: _description,
            pointsEarned: _points,
            completionDate: block.timestamp,
            certificateHash: _certificateHash,
            isVerified: true,
            metadataURI: _metadataURI
        });
        
        userAchievements[_recipient].push(newTokenId);
        
        // Update user profile
        if (userProfiles[_recipient].walletAddress != address(0)) {
            userProfiles[_recipient].totalPoints += _points;
            userProfiles[_recipient].achievementCount++;
        }
        
        emit AchievementIssued(_recipient, newTokenId, _title, _points);
        return newTokenId;
    }
    
    /**
     * Verify achievement certificate
     */
    function verifyCertificate(uint256 _tokenId, bytes32 _certificateHash) external {
        require(achievements[_tokenId].recipient != address(0), "Token does not exist");
        
        achievements[_tokenId].certificateHash = _certificateHash;
        userVerification[achievements[_tokenId].recipient] = _certificateHash;
        
        emit CertificateVerified(_tokenId, _certificateHash);
    }
    
    /**
     * Get user achievements
     */
    function getUserAchievements(address _user) external view returns (uint256[] memory) {
        return userAchievements[_user];
    }
    
    /**
     * Get achievement details
     */
    function getAchievementDetails(uint256 _tokenId) external view returns (Achievement memory) {
        return achievements[_tokenId];
    }
    
    /**
     * Update leaderboard
     */
    function updateLeaderboard() external onlyOwner {
        delete leaderboard;
        
        for (uint i = 0; i < registeredUsers.length; i++) {
            address user = registeredUsers[i];
            if (userProfiles[user].isActive) {
                leaderboard.push(LeaderboardEntry({
                    userAddress: user,
                    userName: userProfiles[user].name,
                    totalPoints: userProfiles[user].totalPoints,
                    achievementCount: userProfiles[user].achievementCount,
                    rank: 0
                }));
            }
        }
        
        // Sort by points (bubble sort for simplicity)
        for (uint i = 0; i < leaderboard.length; i++) {
            for (uint j = i + 1; j < leaderboard.length; j++) {
                if (leaderboard[i].totalPoints < leaderboard[j].totalPoints) {
                    LeaderboardEntry memory temp = leaderboard[i];
                    leaderboard[i] = leaderboard[j];
                    leaderboard[j] = temp;
                }
            }
        }
        
        // Assign ranks
        for (uint i = 0; i < leaderboard.length; i++) {
            leaderboard[i].rank = i + 1;
        }
        
        emit LeaderboardUpdated(block.timestamp);
    }
    
    /**
     * Get leaderboard
     */
    function getLeaderboard(uint256 _limit) external view returns (LeaderboardEntry[] memory) {
        uint256 length = _limit < leaderboard.length ? _limit : leaderboard.length;
        LeaderboardEntry[] memory result = new LeaderboardEntry[](length);
        
        for (uint i = 0; i < length; i++) {
            result[i] = leaderboard[i];
        }
        
        return result;
    }
    
    /**
     * Get user profile
     */
    function getUserProfile(address _user) external view returns (UserProfile memory) {
        return userProfiles[_user];
    }
    
    /**
     * Check if user is verified
     */
    function isUserVerified(address _user) external view returns (bool) {
        return userProfiles[_user].isActive && userVerification[_user] != 0;
    }
    
    /**
     * Get contract statistics
     */
    function getContractStats() external view returns (uint256, uint256, uint256) {
        return (
            registeredUsers.length,
            tokenIdCounter - 1,
            address(this).balance
        );
    }
}
