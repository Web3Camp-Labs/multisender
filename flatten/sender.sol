// File: @openzeppelin/contracts/token/ERC20/IERC20.sol

// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

/**
 * @dev Interface of the ERC20 standard as defined in the EIP.
 */
interface IERC20 {
    /**
     * @dev Returns the amount of tokens in existence.
     */
    function totalSupply() external view returns (uint256);

    /**
     * @dev Returns the amount of tokens owned by `account`.
     */
    function balanceOf(address account) external view returns (uint256);

    /**
     * @dev Moves `amount` tokens from the caller's account to `recipient`.
     *
     * Returns a boolean value indicating whether the operation succeeded.
     *
     * Emits a {Transfer} event.
     */
    function transfer(address recipient, uint256 amount) external returns (bool);

    /**
     * @dev Returns the remaining number of tokens that `spender` will be
     * allowed to spend on behalf of `owner` through {transferFrom}. This is
     * zero by default.
     *
     * This value changes when {approve} or {transferFrom} are called.
     */
    function allowance(address owner, address spender) external view returns (uint256);

    /**
     * @dev Sets `amount` as the allowance of `spender` over the caller's tokens.
     *
     * Returns a boolean value indicating whether the operation succeeded.
     *
     * IMPORTANT: Beware that changing an allowance with this method brings the risk
     * that someone may use both the old and the new allowance by unfortunate
     * transaction ordering. One possible solution to mitigate this race
     * condition is to first reduce the spender's allowance to 0 and set the
     * desired value afterwards:
     * https://github.com/ethereum/EIPs/issues/20#issuecomment-263524729
     *
     * Emits an {Approval} event.
     */
    function approve(address spender, uint256 amount) external returns (bool);

    /**
     * @dev Moves `amount` tokens from `sender` to `recipient` using the
     * allowance mechanism. `amount` is then deducted from the caller's
     * allowance.
     *
     * Returns a boolean value indicating whether the operation succeeded.
     *
     * Emits a {Transfer} event.
     */
    function transferFrom(address sender, address recipient, uint256 amount) external returns (bool);

    /**
     * @dev Emitted when `value` tokens are moved from one account (`from`) to
     * another (`to`).
     *
     * Note that `value` may be zero.
     */
    event Transfer(address indexed from, address indexed to, uint256 value);

    /**
     * @dev Emitted when the allowance of a `spender` for an `owner` is set by
     * a call to {approve}. `value` is the new allowance.
     */
    event Approval(address indexed owner, address indexed spender, uint256 value);
}

// File: @openzeppelin/contracts/utils/Context.sol


pragma solidity ^0.8.0;

/*
 * @dev Provides information about the current execution context, including the
 * sender of the transaction and its data. While these are generally available
 * via msg.sender and msg.data, they should not be accessed in such a direct
 * manner, since when dealing with meta-transactions the account sending and
 * paying for execution may not be the actual sender (as far as an application
 * is concerned).
 *
 * This contract is only required for intermediate, library-like contracts.
 */
abstract contract Context {
    function _msgSender() internal view virtual returns (address) {
        return msg.sender;
    }

    function _msgData() internal view virtual returns (bytes calldata) {
        this; // silence state mutability warning without generating bytecode - see https://github.com/ethereum/solidity/issues/2691
        return msg.data;
    }
}

// File: @openzeppelin/contracts/access/Ownable.sol


pragma solidity ^0.8.0;

/**
 * @dev Contract module which provides a basic access control mechanism, where
 * there is an account (an owner) that can be granted exclusive access to
 * specific functions.
 *
 * By default, the owner account will be the one that deploys the contract. This
 * can later be changed with {transferOwnership}.
 *
 * This module is used through inheritance. It will make available the modifier
 * `onlyOwner`, which can be applied to your functions to restrict their use to
 * the owner.
 */
abstract contract Ownable is Context {
    address private _owner;

    event OwnershipTransferred(address indexed previousOwner, address indexed newOwner);

    /**
     * @dev Initializes the contract setting the deployer as the initial owner.
     */
    constructor () {
        address msgSender = _msgSender();
        _owner = msgSender;
        emit OwnershipTransferred(address(0), msgSender);
    }

    /**
     * @dev Returns the address of the current owner.
     */
    function owner() public view virtual returns (address) {
        return _owner;
    }

    /**
     * @dev Throws if called by any account other than the owner.
     */
    modifier onlyOwner() {
        require(owner() == _msgSender(), "Ownable: caller is not the owner");
        _;
    }

    /**
     * @dev Leaves the contract without owner. It will not be possible to call
     * `onlyOwner` functions anymore. Can only be called by the current owner.
     *
     * NOTE: Renouncing ownership will leave the contract without an owner,
     * thereby removing any functionality that is only available to the owner.
     */
    function renounceOwnership() public virtual onlyOwner {
        emit OwnershipTransferred(_owner, address(0));
        _owner = address(0);
    }

    /**
     * @dev Transfers ownership of the contract to a new account (`newOwner`).
     * Can only be called by the current owner.
     */
    function transferOwnership(address newOwner) public virtual onlyOwner {
        require(newOwner != address(0), "Ownable: new owner is the zero address");
        emit OwnershipTransferred(_owner, newOwner);
        _owner = newOwner;
    }
}

// File: contracts/MultiSender.sol

pragma solidity >=0.8.0 <0.9.0;



contract MultiSender is Ownable {
    constructor() {}

    uint16 public arrayLimit = 200;

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
        IERC20 token = IERC20(_token);
        uint256 total = 0;
        for (uint256 i = 0; i < _targets.length; i++) {
            require(token.transferFrom(msg.sender, _targets[i], _amounts[i]));
            total += _amounts[i];
        }
        emit MultisendToken(total, _token);
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
        require(address(this).balance >= total, "Insufficent fund");

        for (uint256 i = 0; i < _targets.length; i++) {
            (bool sent, bytes memory data) = _targets[i].call{
                value: _amounts[i]
            }("");
            require(sent, "transfer eth failed");
            total += _amounts[i];
        }

        // emit MultisendToken(total, address(0));
    }

    function claimTokens(address _token) public onlyOwner {
        address owner = this.owner();
        uint256 balance = 0x0;

        if (_token == address(0x0)) {
            balance = address(this).balance;
            (bool sent, bytes memory data) = owner.call{value: balance}("");
            require(sent, "transfer eth failed");
            emit ClaimedToken(address(0x0), owner, balance);
            return;
        }

        IERC20 erc20token = IERC20(_token);
        balance = erc20token.balanceOf(address(this));
        erc20token.transfer(owner, balance);
        emit ClaimedToken(_token, owner, balance);
    }
}
