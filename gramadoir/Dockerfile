from ubuntu
run apt update; apt upgrade -y
run apt install -y liblingua-ga-gramadoir-perl
run apt install -y libcgi-pm-perl
run apt install -y libdatetime-perl
run apt install -y libjson-perl
run apt install -y libencode-perl
run apt install -y liblog-dispatch-filerotate-perl
copy gramadoir.pl /usr/lib/cgi-bin/
run apt install -y apache2
run a2enmod cgi
copy apache2.conf /etc/apache2/apache2.conf
CMD ["apachectl", "-D", "FOREGROUND"]