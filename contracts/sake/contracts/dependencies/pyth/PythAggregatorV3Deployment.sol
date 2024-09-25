// SPDX-License-Identifier: Apache 2
pragma solidity ^0.8.10;

import {PythAggregatorV3} from "@pythnetwork/pyth-sdk-solidity/PythAggregatorV3.sol";

contract PythAggregatorV3Deployment {
    event AggregatorsDeployed(address[] aggregators);

    function deployAggregators(
        address pythPriceFeedsContract,
        bytes32[] memory feedIds
    ) public returns (address[] memory) {
        require(feedIds.length > 0, "At least one feed ID is required");

        address[] memory aggregatorAddresses = new address[](feedIds.length);

        for (uint i = 0; i < feedIds.length; i++) {
            PythAggregatorV3 aggregator = new PythAggregatorV3(
                pythPriceFeedsContract,
                feedIds[i]
            );
            aggregatorAddresses[i] = address(aggregator);
        }

        emit AggregatorsDeployed(aggregatorAddresses);

        return aggregatorAddresses;
    }
}
