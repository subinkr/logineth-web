// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract NFT is ERC721 {
    address ADMIN;
    
    constructor (string memory _name, string memory _symbol) ERC721(_name, _symbol) {
        ADMIN = msg.sender;
    }

    event getTokenID(uint256 tokenID);
    string[] tokenURIs;
    address[] genesisOwners;
    address[] owners;
    uint256[] tokenPrices;

    mapping(address account => uint256 balance) balances;

    uint256 constant public DEFAULT_PRICE = 10 ** 16;
    uint256 public totalSupply = 0;

    struct TokenInfo {
        string tokenURI;
        address genesisOwners;
        address owner;
        uint256 tokenPrice;
    }

    function getTokenURI(uint256 _tokenID) public view returns (string memory) {
        return tokenURIs[_tokenID];
    }

    function getOwner(uint256 _tokenID) public view returns (address) {
        return owners[_tokenID];
    }

    function getTokenPrice(uint256 _tokenID) public view returns (uint256) {
        return tokenPrices[_tokenID];
    }

    function getTokenInfo(uint256 _tokenID) public view returns (TokenInfo memory) {
        return TokenInfo (
            tokenURIs[_tokenID],
            genesisOwners[_tokenID],
            owners[_tokenID],
            tokenPrices[_tokenID]
        );
    }

    function minting(string memory _tokenURI, address _originalAuthor) public {
        tokenURIs.push(_tokenURI);
        genesisOwners.push(_originalAuthor);
        owners.push(msg.sender);
        tokenPrices.push(DEFAULT_PRICE);

        _mint(msg.sender, totalSupply);

        emit getTokenID(totalSupply);
        totalSupply++;
    }

    function tokenURI(uint256 _tokenID) public view override returns (string memory) {
        return tokenURIs[_tokenID];
    }

    function buyToken(uint256 _tokenID) public payable {
        require(tokenPrices[_tokenID] <= msg.value);
        require(owners[_tokenID] != msg.sender);

        (bool result1, ) = payable(owners[_tokenID]).call{value: msg.value * 10 / 12}("");
        require(result1);
        (bool result2, ) = payable(genesisOwners[_tokenID]).call{value: msg.value * 1 / 12}("");
        require(result2);
        (bool result3, ) = payable(ADMIN).call{value: msg.value * 1 / 12}("");
        require(result3);

        _transfer(owners[_tokenID], msg.sender, _tokenID);
        owners[_tokenID] = msg.sender;
        tokenPrices[_tokenID] = msg.value * 12 / 10;
    }
}