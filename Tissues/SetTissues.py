import json
import math
import os

dir_path = os.path.dirname(os.path.abspath(__file__))

with open(os.path.join(dir_path, "Tissues.json"), "r") as allTissues_f:
    allTissues = json.load(allTissues_f)

save_flag = input("Start saving? [Y/n]")
while True:
    if save_flag.lower().startswith("n"):
        break

    file_name = (input("file name: "))
    if file_name not in allTissues:
        allTissues.append(file_name)

    with open(os.path.join(dir_path, "{}.json".format(file_name)), "w") as newTissue_f:
        newTissue = {}
        newTissue["name"] = input("tissue name: ")
        newTissue["cursor-tissue"] = {"data": []}

        print("data:")
        while True:
            row_str = input()
            if row_str == "":
                break

            row = [bool(int(digit)) for digit in row_str if digit.isdigit()]
            newTissue["cursor-tissue"]["data"].append(row)

        vNumb = len(newTissue["cursor-tissue"]["data"])
        hNumb = max(len(row) for row in newTissue["cursor-tissue"]["data"])
        newTissue["cursor-tissue"]["apex"] = [
            [math.ceil(-vNumb / 2), math.ceil(-hNumb / 2)],
            [math.ceil(vNumb / 2), math.ceil(hNumb / 2)]
        ]
        for row in newTissue["cursor-tissue"]["data"]:
            while len(row) < hNumb:
                row.append(False)
        json.dump(newTissue, newTissue_f)

    save_flag = input("Continue saving? [Y/n]")

with open(os.path.join(dir_path, "Tissues.json"), "w") as allTissues_f:
    json.dump(allTissues, allTissues_f)


[
    "danbau",
    "majtrungssing",
    "xyassjangczi",
    "xyassjangcsiang",
    "csingssignfeitryan",
    "drungssignfeitryan",
    "drunxssignfeitryan"
]