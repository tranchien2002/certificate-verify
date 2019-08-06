# Install Samples, Binaries and Docker Images
curl -sSL http://bit.ly/2ysbOFE | bash -s

# Generate channel congiguration and achor peer for Orgs
cd network
./generate.sh

# Start network
./start.sh
