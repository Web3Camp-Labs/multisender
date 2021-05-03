// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract MultiSender is Ownable {
    constructor() {}

    function batchSendToken(
        address _token,
        address[] memory _targets,
        uint256[] memory _amount
    ) public returns (bool success) {
        IERC20 token = IERC20(_token);
        for (uint256 i = 0; i < _targets.length; i++) {
            require(token.transferFrom(msg.sender, _targets[i], _amount[i]));
        }
        return true;
    }

    function checkSufficient(
        address _token,
        address[] memory _targets,
        uint256[] memory _amount
    ) public view returns (bool success) {
        IERC20 token = IERC20(_token);
        uint256 tokenBalance = token.balanceOf(msg.sender);

        for (uint256 j = 0; j < _targets.length; j++) {
            tokenBalance = tokenBalance - _amount[j];
        }
        return true;
    }
}
