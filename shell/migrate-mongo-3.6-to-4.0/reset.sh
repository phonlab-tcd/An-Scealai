apt remove mongodb-org*
apt purge mongodb-org*
apt autoremove mongodb-org*
apt-get install mongodb
apt-key del E52529D4
systemctl start mongodb
supervisorctl start scealai

