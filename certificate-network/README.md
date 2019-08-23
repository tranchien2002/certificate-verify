# Install Samples, Binaries and Docker Images
curl -sSL http://bit.ly/2ysbOFE | bash -s

cp -r fabric-samples/bin .

# Generate channel congiguration and achor peer for Orgs
mkdir network/channel-artifacts

cd network

./generate.sh

# Start network
./start.sh
