if [ -z "`which nginx`" ] ; then
	brew install nginx
fi
nginx
dest="/etc/nginx/sites-available/localhost:4040"
cp ./conf/dev.nginx.conf $dest
ln -s $dest /etc/nginx/sites-enabled
nginx -t
nginx -s reload
