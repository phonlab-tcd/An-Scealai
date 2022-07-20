echo -e "WARNING: assuming apt-keys for mongodbv4.2 or later have not been added"
set -e
wget -qO - https://www.mongodb.org/static/pgp/server-4.0.asc | sudo apt-key add -
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu bionic/mongodb-org/4.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-4.0.list
apt-get update

mongodump --gzip zip-dump
apt-get purge mongodb
sytemctl stop mongodb
supervisorctrl stop scealai
mkdir backup
mv /data/db/* backup

apt-get install -y mongodb-org
systemctl start mongodb
mongorestore --gzip -i zip-dump
