## Step 1. Certificate Network Config

./generate.sh

# Step 2. start network

./start.sh

## Step 3

docker exec -it cli bash

## Step 4. Create Channel

export CHANNEL_NAME=certificatechannel
peer channel create -o orderer.certificate.com:7050 -c $CHANNEL_NAME -f ./channel-artifacts/channel.tx

## Step 5. join peer0.academy.certificate.com to the channel

peer channel join -b certificatechannel.block

## Step 6. join peer0.student.certificate.com to the channel

CORE_PEER_ADDRESS=peer0.student.certificate.com:7051 CORE_PEER_LOCALMSPID=StudentMSP CORE_PEER_MSPCONFIGPATH=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/student.certificate.com/users/Admin@student.certificate.com/msp CORE_PEER_TLS_ROOTCERT_FILE=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/student.certificate.com/peers/peer0.student.certificate.com/tls/ca.crt peer channel join -b certificatechannel.block

## Step 7. Define the anchor peer for Academy as peer0.academy.certificate.com

CORE_PEER_ADDRESS=peer0.academy.certificate.com:7051 CORE_PEER_LOCALMSPID=AcademyMSP CORE_PEER_MSPCONFIGPATH=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/academy.certificate.com/users/Admin@academy.certificate.com/msp CORE_PEER_TLS_ROOTCERT_FILE=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/academy.certificate.com/peers/peer0.academy.certificate.com/tls/ca.crt peer channel update -o orderer.certificate.com:7050 -c $CHANNEL_NAME -f ./channel-artifacts/AcademyMSPanchors.tx

## Step 8. Define the anchor peer for Student as peer0.student.certificate.com

CORE_PEER_ADDRESS=peer0.student.certificate.com:8051 CORE_PEER_LOCALMSPID=StudentMSP CORE_PEER_MSPCONFIGPATH=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/student.certificate.com/users/Admin@student.certificate.com/msp CORE_PEER_TLS_ROOTCERT_FILE=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/student.certificate.com/peers/peer0.student.certificate.com/tls/ca.crt peer channel update -o orderer.certificate.com:7050 -c $CHANNEL_NAME -f ./channel-artifacts/StudentMSPanchors.tx

## Step 9. Install the chaincode onto the peer0 node in Academy

CORE_PEER_ADDRESS=peer0.academy.certificate.com:7051 CORE_PEER_LOCALMSPID=AcademyMSP CORE_PEER_MSPCONFIGPATH=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/academy.certificate.com/users/Admin@academy.certificate.com/msp CORE_PEER_TLS_ROOTCERT_FILE=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/academy.certificate.com/peers/peer0.academy.certificate.com/tls/ca.crt peer chaincode install -n mycc -v 1.0 -p github.com/chaincode/academy/go/

## Step 10. Instantiate the chaincode onto the peer0 node in Student

CORE_PEER_ADDRESS=peer0.academy.certificate.com:7051 CORE_PEER_LOCALMSPID=AcademyMSP CORE_PEER_MSPCONFIGPATH=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/academy.certificate.com/users/Admin@academy.certificate.com/msp CORE_PEER_TLS_ROOTCERT_FILE=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/academy.certificate.com/peers/peer0.academy.certificate.com/tls/ca.crt peer chaincode instantiate -o orderer.certificate.com:7050 -C $CHANNEL_NAME -n mycc -v 1.0 -c '{"Args":[]}' -P "AND ('AcademyMSP.peer','StudentMSP.peer')"

## Step 11. Install the chaincode onto the peer0 node in Student

CORE_PEER_ADDRESS=peer0.student.certificate.com:7051 CORE_PEER_LOCALMSPID=StudentMSP CORE_PEER_MSPCONFIGPATH=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/student.certificate.com/users/Admin@student.certificate.com/msp CORE_PEER_TLS_ROOTCERT_FILE=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/student.certificate.com/peers/peer0.student.certificate.com/tls/ca.crt peer chaincode install -n mycc -v 1.0 -p github.com/chaincode/academy/go/

# Step 12. Invoke chaincode

peer chaincode invoke -o orderer.certificate.com:7050 -C $CHANNEL_NAME -n mycc --peerAddresses peer0.academy.certificate.com:7051 --tlsRootCertFiles /opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/academy.certificate.com/peers/peer0.academy.example.com/tls/ca.crt --peerAddresses peer0.student.certificate.com:7051 --tlsRootCertFiles /opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/student.certificate.com/peers/peer0.student.certificate.com/tls/ca.crt -c '{"Args":["CreateStudent","20156426","Hoang Ngoc Phuc"]}'

#Step 14. Query Chaincode

peer chaincode query -C $CHANNEL_NAME -n mycc -c '{"Args":["QueryStudent","20156426"]}'
