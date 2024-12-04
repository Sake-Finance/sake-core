#!/bin/bash

git diff --name-only main:contracts/core-v3/contracts aave-v3-core/master:contracts -- > core_contracts_diff_output.txt
