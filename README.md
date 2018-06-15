# Setup

* Switch to node version 5><9 (e.g. v8.1.3). Use Node version manager (nvm) to quickly switch between node versions.
* `yarn`
* `cd ios && pod install`
* `mkdir env` --> copy keys.json file into `./env` (ask admin for file, not in repo)
* Add signing certificate in Xcode UI --> splash.xcworkspace --> general
* To start the project: `react-native run-ios`
  If it fails due to an `fsevents` error, run
  `npm r -g watchman brew install watchman`. It should fix it.
