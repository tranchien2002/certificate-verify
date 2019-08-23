#!/bin/bash

echo
echo " ____    _____      _      ____    _____ "
echo "/ ___|  |_   _|    / \    |  _ \  |_   _|"
echo "\___ \    | |     / _ \   | |_) |   | |  "
echo " ___) |   | |    / ___ \  |  _ <    | |  "
echo "|____/    |_|   /_/   \_\ |_| \_\   |_|  "
echo
echo
CHAINCODE_NAME="$1"
VERSION="$2"
LANGUAGE="$3"
TIMEOUT="$4"
: ${CHANNEL_NAME:="certificatechannel"}
: ${CHAINCODE_NAME:=""}
: ${VERSION:="0"}
: ${DELAY:="3"}
: ${LANGUAGE:="golang"}
: ${TIMEOUT:="10"}
LANGUAGE=`echo "$LANGUAGE" | tr [:upper:] [:lower:]`
COUNTER=1
MAX_RETRY=5
ORDERER_CA=

CC_SRC_PATH="/opt/gopath/src/github.com/chaincode/$CHAINCODE_NAME/go"

echo "Channel name : "$CHANNEL_NAME
echo "Chaincode name : "$CHAINCODE_NAME
echo "Chaincode version : "$VERSION

source ./scripts/common.sh

installChaincode() {
  PEER=$1
  CLUSTER=$2
  ORG_NAME=$3
  setGlobals $PEER $CLUSTER
  VERSION=${3:-1.0}
  set -x
  peer chaincode install -n $CHAINCODE_NAME -v ${VERSION} -l ${LANGUAGE} -p ${CC_SRC_PATH} >&log.txt
  res=$?
  set +x
  cat log.txt
  verifyResult $res "Chaincode installation on peer${PEER}.${ORG_NAME} has failed"
  echo "===================== Chaincode is installed on peer${PEER}.${ORG_NAME} ===================== "
  echo
}

instantiateChaincode() {
  PEER=$1
  CLUSTER=$2
  ORG_NAME=$3
  setGlobals $PEER $CLUSTER
  VERSION=${3:-0}

  # while 'peer chaincode' command can get the orderer endpoint from the peer
  # (if join was successful), let's supply it directly as we know it using
  # the "-o" option
  if [ -z "$CORE_PEER_TLS_ENABLED" -o "$CORE_PEER_TLS_ENABLED" = "false" ]; then
    set -x
    peer chaincode instantiate -o orderer.certificate.com:7050 -C $CHANNEL_NAME -n $CHAINCODE_NAME -l ${LANGUAGE} -v ${VERSION} -c '{"Args":[]}' -P "OR ('AcademyMSP.member','StudentMSP.member')" >&log.txt
    res=$?
    set +x
  else
    set -x
    peer chaincode instantiate -o orderer.certificate.com:7050 --tls $CORE_PEER_TLS_ENABLED --cafile $ORDERER_CA -C $CHANNEL_NAME -n $CHAINCODE_NAME -l ${LANGUAGE} -v 0 -c '{"Args":[]}' -P "OR ('AcademyMSP.member','StudentMSP.member')" >&log.txt
    res=$?
    set +x
  fi
  cat log.txt
  verifyResult $res "Chaincode instantiation on peer${PEER}.${ORG_NAME} on channel '$CHANNEL_NAME' failed"
  echo "===================== Chaincode is instantiated on peer${PEER}.${ORG_NAME} on channel '$CHANNEL_NAME' ===================== "
  echo
}

upgradeChaincode() {
  PEER=$1
  CLUSTER=$2
  ORG_NAME=$3
  setGlobals $PEER $CLUSTER

  if [ -z "$CORE_PEER_TLS_ENABLED" -o "$CORE_PEER_TLS_ENABLED" = "false" ]; then
    set -x
    peer chaincode upgrade -o orderer.certificate.com:7050 -C $CHANNEL_NAME -n $CHAINCODE_NAME -v ${VERSION} -c '{"Args":[]}' -P "OR ('AcademyMSP.member','StudentMSP.member')"
    res=$?
    set +x
  else
    set -x
    peer chaincode upgrade -o orderer.certificate.com:7050 --tls $CORE_PEER_TLS_ENABLED --cafile $ORDERER_CA -C $CHANNEL_NAME -n $CHAINCODE_NAME -v ${VERSION} -c '{"Args":[]}' -P "OR ('AcademyMSP.client','StudentMSP.client')"
    res=$?
    set +x
  fi
  cat log.txt
  verifyResult $res "Chaincode upgrade on peer${PEER}.${ORG_NAME} has failed"
  echo "===================== Chaincode is upgraded on peer${PEER}.${ORG_NAME} on channel '$CHANNEL_NAME' ===================== "
  echo
}

chaincodeQuery() {
  PEER=$1
  CLUSTER=$2
  QUERY=$3
  setGlobals $PEER $CLUSTER
  echo "===================== Querying on peer${PEER}.${CLUSTER} on channel '$CHANNEL_NAME'... ===================== "

  set -x
  peer chaincode query -C $CHANNEL_NAME -n $CHANNEL_NAME -c ${QUERY} >&log.txt
  res=$?
  set +x
  cat log.txt
  verifyResult $res "Query result on peer${PEER}.${CLUSTER} is INVALID !!!!!!!!!!!!!!!!"
  echo "===================== Query successful on peer${PEER}.${CLUSTER} on channel '$CHANNEL_NAME' ===================== "
  echo
}

chaincodeInvoke() {
  parsePeerConnectionParameters $@
  res=$?
  verifyResult $res "Invoke transaction failed on channel '$CHANNEL_NAME' due to uneven number of peer and cluster parameters "

  # while 'peer chaincode' command can get the orderer endpoint from the
  # peer (if join was successful), let's supply it directly as we know
  # it using the "-o" option
  if [ -z "$CORE_PEER_TLS_ENABLED" -o "$CORE_PEER_TLS_ENABLED" = "false" ]; then
    set -x
    peer chaincode invoke -o orderer.certificate.com:7050 -C $CHANNEL_NAME -n $CHAINCODE_NAME $PEER_CONN_PARMS -c '{"Args":[]}' >&log.txt
    res=$?
    set +x
  else
    set -x
    peer chaincode invoke -o orderer.certificate.com:7050 --tls $CORE_PEER_TLS_ENABLED --cafile $ORDERER_CA -C $CHANNEL_NAME -n $CHAINCODE_NAME $PEER_CONN_PARMS -c '{"Args":[]}' >&log.txt
    res=$?
    set +x
  fi
  cat log.txt
  verifyResult $res "Invoke execution on $PEERS failed "
  echo "===================== Invoke transaction successful on $PEERS on channel '$CHANNEL_NAME' ===================== "
  echo
}


## Installing chaincode
echo "Installing chaincode"
installChaincode 0  1 "academy" $VERSION
sleep 1

## Instantiating chaincode
echo "Instantiating chaincode"
instantiateChaincode 0 1 "academy" $VERSION
sleep 1

## Upgrading chaincode
#echo "Upgrading chaincode"
#upgradeChaincode 0 1 "academy" $VERSION
#sleep 1

## Query chaincode
# echo "Query chaincode"
# queryChaincode
# sleep 1

## Invoke chaincode
# echo "Invoke chaincode"
# invokeChaincode
# sleep 1

echo "Done!"
