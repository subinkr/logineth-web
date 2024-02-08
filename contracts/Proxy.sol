// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract Proxy {
    bytes32 public constant IMPL_SLOT = bytes32(uint(keccak256("IMPL")) - 1);
    bytes32 public constant ADMIN_SLOT = bytes32(uint(keccak256("ADMIN")) - 1);

    constructor() {
        setOwner(msg.sender);
    }

    modifier onlyOwner() {
        require(msg.sender == getOwner());
        _;
    }

    function getOwner() private view returns (address) {
        return Slot.getAddressSlot(ADMIN_SLOT).value;
    }

    function setOwner(address owner) private {
        Slot.getAddressSlot(ADMIN_SLOT).value = owner;
    }

    function getImpl() private view returns (address) {
        return Slot.getAddressSlot(IMPL_SLOT).value;
    }

    function setImpl(address _CA) public onlyOwner {
        Slot.getAddressSlot(IMPL_SLOT).value = _CA;
    }

    function getAdmin() external view returns (address) {
        return getOwner();
    }

    function getEImpl() external view returns (address) {
        return getImpl();
    }

    function delegate(address impl) private {
        assembly {
            calldatacopy(0, 0, calldatasize())

            let result := delegatecall(gas(), impl, 0, calldatasize(), 0, 0)
            returndatacopy(0, 0, returndatasize())

            switch result
            case 0 {
                revert(0, returndatasize())
            }
            default {
                return(0, returndatasize())
            }
        }
    }

    fallback() external payable {
        delegate(getImpl());
    }

    receive() external payable {
        delegate(getImpl());
    }
}

library Slot {
    struct AddressSlot {
        address value;
    }

    function getAddressSlot(bytes32 slot) internal pure returns (AddressSlot storage pointer) {
        assembly {
            pointer.slot := slot
        }
    }
}