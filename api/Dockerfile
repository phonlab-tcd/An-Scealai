# from node
# run apt update
# run apt install -y pandoc
# workdir /app
# expose 4000:4000
# env DB_HOSTNAME=scealai-mongo:27017/
# entrypoint ["npm", "run", "start:nocheck"]

FROM node:16

run apt update
run apt install -y pandoc

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
COPY package*.json ./

RUN npm install

from ubuntu
run apt update; apt upgrade -y
run apt install -y liblingua-ga-gramadoir-perl
run apt install -y libcgi-pm-perl
run apt install -y libdatetime-perl
run apt install -y libjson-perl
run apt install -y libencode-perl
run apt install -y liblog-dispatch-filerotate-perl
run apt install -y libapache2-mod-fcgid
copy gramadoir /usr/bin/gramadoir
run chmod +x /usr/bin/gramadoir

# Bundle app source
COPY . .

EXPOSE 4000:4000

# ENV DB_HOSTNAME=scealai-mongo:27017/

entrypoint ["npm", "run", "start:nocheck"]