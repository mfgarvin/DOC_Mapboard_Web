import csv
import json

data = []
with open("activity-data.csv") as input_file:
    reader = csv.DictReader(input_file)
    for row in reader:
        data.append(row)

with open("activity-data.json", "w") as output_file:
    json.dump(data, output_file)

    
