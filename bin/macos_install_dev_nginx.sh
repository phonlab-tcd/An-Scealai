if [ -z "`which nginx`" ] ; then
	brew install eginx
	brew services start nginx
fi
dest="/usr/local/etc/nginx/servers/localhost:4040"
cp ./conf/dev.nginx.conf
nginx -t
nginx -s reload
