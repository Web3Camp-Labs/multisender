// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts-upgradeable/token/ERC20/IERC20Upgradeable.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC20/utils/SafeERC20Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/security/ReentrancyGuardUpgradeable.sol";

contract MultiSender is OwnableUpgradeable, ReentrancyGuardUpgradeable {
    using SafeERC20Upgradeable for IERC20Upgradeable;

    address constant ETH_ADDRESS = 0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE;
    uint16 public arrayLimit;

    function initialize() public initializer {
        __ReentrancyGuard_init();
        __Ownable_init();

        arrayLimit = 200;
    }

    event MultisendToken(uint256 total, address tokenAddress);
    event ClaimedToken(address token, address owner, uint256 balance);

    function batchSendERC20(
        address _token,
        address[] memory _targets,
        uint256[] memory _amounts
    ) public returns (bool success) {
        require(
            _targets.length == _amounts.length,
            "The length of params are not equal."
        );
        IERC20Upgradeable token = IERC20Upgradeable(_token);
        uint256 total = 0;
        for (uint256 i = 0; i < _targets.length; i++) {
            token.safeTransferFrom(msg.sender, _targets[i], _amounts[i]);
            total += _amounts[i];
        }
        emit MultisendToken(total, _token);
        return true;
    }

    function batchSendFixedERC20(
        address _token,
        address[] memory _targets,
        uint256 _amount
    ) public {
        require(_targets.length > 0, "none address provided");

        IERC20Upgradeable token = IERC20Upgradeable(_token);
        uint256 total = _amount * _targets.length;
        for (uint256 i = 0; i < _targets.length; i++) {
            token.safeTransferFrom(msg.sender, _targets[i], _amount);
        }
        emit MultisendToken(total, _token);
    }

    function batchSendEther(
        address payable[] memory _targets,
        uint256[] memory _amounts
    ) public payable {
        require(
            _targets.length == _amounts.length,
            "The length of params are not equal."
        );

        uint256 total = 0;
        for (uint256 i = 0; i < _targets.length; i++) {
            total += _amounts[i];
        }
        require(msg.value >= total, "Insufficient fund");

        for (uint256 i = 0; i < _targets.length; i++) {
            (bool sent, ) = _targets[i].call{value: _amounts[i]}("");
            require(sent, "transfer eth failed");
            total += _amounts[i];
        }

        emit MultisendToken(total, address(0));
    }

    function batchSendFixedEther(
        address payable[] memory _targets,
        uint256 _amount
    ) public payable {
        require(_targets.length > 0, "none address provided");
        uint256 total = _targets.length * _amount;

        require(msg.value >= total, "insufficient fund");

        for (uint256 i = 0; i < _targets.length; i++) {
            (bool sent, ) = _targets[i].call{value: _amount}("");
            require(sent, "transfer eth failed");
        }

        emit MultisendToken(total, address(0));
    }

    function claimBalance(address _token) public onlyOwner {
        uint256 balance = 0x0;
        address _owner = this.owner();
        if (_token == ETH_ADDRESS) {
            require(address(this).balance > 0x0, "Insufficient balance");
            balance = address(this).balance;
            (bool sent, ) = _owner.call{value: balance}("");
            require(sent, "transfer eth failed");
            emit ClaimedToken(address(0x0), _owner, balance);
            return;
        }

        IERC20Upgradeable erc20token = IERC20Upgradeable(_token);
        balance = erc20token.balanceOf(address(this));
        require(balance > 0x0, "Insufficient balance");
        erc20token.safeTransfer(_owner, balance);
        emit ClaimedToken(_token, _owner, balance);
    }
}
