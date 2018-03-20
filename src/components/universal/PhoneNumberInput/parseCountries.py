import csv
import json

countries = {}

countryList = []

with open("countryCodes.csv", "rb") as countryCodes:
	countryCodesReader = csv.reader(countryCodes, delimiter=",")
	for entry in countryCodesReader:
		countryName = entry[0]
		countryCode = entry[1]
		if countryName not in countries:
			countries[countryName] = {
				"code": countryCode,
				"flag": ""
			}

with open("countryFlags.txt", "rb") as countryFlagsFile:
	countryFlags = countryFlagsFile.readlines()[0]
	countryFlagsSplit = countryFlags.split(", ")

	for entry in countryFlagsSplit:
		entrySplit = entry.split(" Flag for ")
		flag = entrySplit[0]
		country = entrySplit[1]
		if country not in countryList:
			if country in countries:
				countryList.append(country)
		try:
			countries[country]["flag"] = flag
		except:
			# print(country)
			pass

with open('countryData.json', 'w') as fp:
    json.dump(countries, fp)

print(countryList)