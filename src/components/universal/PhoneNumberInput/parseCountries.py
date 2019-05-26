import csv
import json

countries = {}

countryList = []

countriesByCode = {}

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
		if countryCode not in countriesByCode:
			countriesByCode[countryCode] = {
				"name": countryName,
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
				countriesByCode[countries[country]["code"]]["flag"] = flag
			except:
				# print(country)
				pass

with open('countryData.json', 'w') as fp:
    json.dump(countries, fp)

with open('countryCodes.json', 'w') as fp:
	json.dump(countriesByCode, fp)