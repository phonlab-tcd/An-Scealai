SCRIPT_DIR=$( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )

echo $'\nCOPYING LOG FILES FROM SERVER...\n'

scp scealai@141.95.1.243:/var/log/mongodb/mongod.log $SCRIPT_DIR/

echo $'\nFILTERING LOG FILES...\n'

mlogfilter $SCRIPT_DIR/mongod.log > $SCRIPT_DIR/filter.mongod.log

echo $'\nANALYSING LOG FILES...\n'

python3 $SCRIPT_DIR/plot_logs.py