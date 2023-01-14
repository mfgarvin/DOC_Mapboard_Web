import csv
import json

data = []
with open("activity-data.csv") as input_file:
    reader = csv.DictReader(input_file)
    for row in reader:
        row["lat"] = float(row["lat"])
        row["lon"] = float(row["lon"])
        row["dayOfWeek"] = int(row["dayOfWeek"])
        row["hourOfDay"] = int(row["hourOfDay"])
        row["minute"] = int(row["minute"])
        row["duration"] = int(row["duration"])
        if row["has24HourAdoration"] == "TRUE":
            row["has24HourAdoration"] = True
        else:
            row["has24HourAdoration"] = False
    
        data.append(row)

with open("activity-data.json", "w") as output_file:
    json.dump(data, output_file)

    
