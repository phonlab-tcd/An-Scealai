from ubuntu
run apt update; apt upgrade -y
run apt install -y liblingua-ga-gramadoir-perl
run apt install -y libcgi-pm-perl
run apt install -y libdatetime-perl
run apt install -y libjson-perl
run apt install -y libencode-perl
run apt install -y liblog-dispatch-filerotate-perl
run apt install -y libapache2-mod-fcgid
run apt install libcgi-fast-perl
copy gramadoir.pl /var/www/fcgi-bin/gramadoir.pl
run apt install -y apache2
run a2enmod fastcgi
copy apache2.conf /etc/apache2/apache2.conf
run chmod -R 775 /var/www/fcgi-bin/
#run chown -R root:apache /var/www/fcgi-bin/
run chmod +x /var/www/fcgi-bin/gramadoir.pl
CMD ["apachectl", "-D", "FOREGROUND"]