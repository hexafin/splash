# Hexa React Native App

## Getting Started

### Install Dependencies

`npm install`

### Run Application

`react-native run-ios`

# Bundle command

drag main.jsbundle and assets into xcode

`react-native bundle --entry-file index.js --platform ios --dev false --bundle-output ios/main.jsbundle --assets-dest ./ios`

If running with CodePush:
Bundle, uncomment CodePush line in AppDelegate.m, then run these commands

`code-push release Splash-iOS ios/main.jsbundle VERSION` making sure to substitute the version

`export SENTRY_PROPERTIES=./ios/sentry.properties`

`sentry-cli react-native codepush Splash-iOS ios ./ios`

### Add Environment Variables

`mkdir env`
`cd env`

add keys to file `keys.json` in json object `{sentryDSN: '', coinbaseClientId: '', coinbaseClientSecret: ''}`
