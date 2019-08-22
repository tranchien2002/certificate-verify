#!/bin/bash

buildChaincodes () {
    chainCodes=(academy)
    versions=(0)

    # chainCodes=(student-degree)
    # versions=(1.14)

    for index in "${!chainCodes[@]}"; do
        ./scripts/buildcontract.sh "${chainCodes[$index]}" "${versions[$index]}"
    done
}

buildChaincodes
