set -e
echo -e "WARNING: assuming apt-keys for mongodbv4.2 or later have not been added"
date_str=`date +"%d-%m-%y-%T"`
mkdir -p migrate-3.6-to-4.0-attempt
cd migrate-3.6-to-4.0-attempt
mkdir $date_str
cd $date_str


# add apt key for mongodb-org 4.0
wget -qO - https://www.mongodb.org/static/pgp/server-4.0.asc | sudo apt-key add -
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu bionic/mongodb-org/4.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-4.0.list
apt update

# stop scealai server (no more data please)
supervisorctl stop scealai
mongodump --gzip
systemctl stop mongodb
apt remove -y mongodb*
apt purge -y mongodb
apt autoremove -y mongodb
mkdir -p raw_backup
mv /var/lib/mongodb/* raw_backup 

# install 4.0
apt install -y mongodb-org
echo -e "INSTALLED VERSION:"
apt list | grep mongodb-org

systemctl unmask mongodb
systemctl start mongodb
mongorestore --gzip
supervisorctl start scealai


curl localhost:4000/story/neimhin
