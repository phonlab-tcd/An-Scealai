from node
run apt update
run apt install -y pandoc
workdir /app
expose 4000:4000
env DB_HOSTNAME=scealai-mongo:27017/
entrypoint ["npm", "run", "start:nocheck"]

