# Use current date in name of backup folder
CURRENT_DATE=`date +"%d_%m_%Y_%T"`

# Create a backup of the live site with the current date in the name
BACKUP_DIR_NAME=./api/node_modules_backup_${CURRENT_DATE}
echo "Moving ./api/node_modules to ${BACKUP_DIR_NAME}" 
mv ./api/node_modules ${BACKUP_DIR_NAME}
npm install --prefix ./api
