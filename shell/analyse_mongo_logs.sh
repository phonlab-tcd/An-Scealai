echo $'\nCOPYING LOG FILES FROM SERVER...\n'

scp scealai@141.95.1.243:/var/log/mongodb/mongod.log .

echo $'\nFILTERING LOG FILES...\n'

mlogfilter mongod.log > filter.mongod.log

echo $'\nANALYSING LOG FILES...\n'

python3 plot_logs.py