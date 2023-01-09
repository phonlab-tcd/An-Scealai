import pandas as pd
from datetime import datetime
import time
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
sns.set(rc={'figure.figsize':(11.7,8.27)})
sns.set_style("whitegrid")

data = []

with open("filter.mongod.log") as file_in:
    for i, line in enumerate(file_in):
        date_string = line.split(' ')[0].split('.')[0]
        date_time = datetime.strptime(date_string, '%Y-%m-%dT%H:%M:%S')
        date = date_time
        ## COMMENT OUT THE FOLLOWING LINE TO DISPLAY HUMAN-READABLE DATE
        date = time.mktime(date_time.timetuple())
        if 'command' in line:
            data.append([date, 0, 'Site in use'])
        if 'serverStatus was very slow' in line:
            data.append([date, 1, 'Server slow'])
        if 'COLLSCAN' in line:
            data.append([date, 2, 'COLLSCAN'])
        if 'got signal 15 (Terminated)' in line:
            data.append([date, 3, 'Server termined'])
        if '***** SERVER RESTARTED *****' in line:
            data.append([date, 4, 'Server crash'])
            
    df = pd.DataFrame(data, columns=['date', 'y', 'type'])

sns.scatterplot(data=df, x="date", y="y", hue="type", s=100, linewidth=0)
plt.show()