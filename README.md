# Hexa React Native App

## Getting Started

### Install Dependencies

`npm install`

### Run Application

`react-native run-ios`

# Bundle command

drag main.jsbundle and assets into xcode

`react-native bundle --entry-file index.js --platform ios --dev false --bundle-output ios/main.jsbundle --assets-dest ./ios`

### Add Environment Variables

`mkdir env`
`cd env`

add keys to file `keys.json` in json object `{sentryDSN: '', coinbaseClientId: '', coinbaseClientSecret: ''}`
