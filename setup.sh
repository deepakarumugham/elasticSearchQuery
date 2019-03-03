#!/bin/bash
sudo su
yum update -y
yum install -y git
curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.32.0/install.sh | bash
. ~/.nvm/nvm.sh
nvm install 8.9.4
git clone https://github.com/deepakarumugham/elasticSearchQuery.git
cd elasticSearchQuery
export NODE_CONFIG_DIR=./etc
npm install
node server.js &
