# Setup

- Switch to node version 5><9 (e.g. v8.1.3).
- `yarn`
- `cd ios && pod install`
- `mkdir env` --> copy keys.json file into `./env` (ask admin for file, not in repo)
- Add signing certificate in Xcode UI --> splash.xcworkspace --> general
- To start the project: `react-native run-ios`
  If it fails due to an `fsevents` error, run
  `npm r -g watchman brew install watchman`. It should fix it.

# Directory

Description and locations of relevant files

## ios

- Configuration of app icons and launch image assets
- integration of native packages with RN
- App facing settings

## src

### assets

- animations (JSON Lottie animations)
- fonts
- icons
- images

### components

each screen in the app is in the components folder. most are folders with the presentational component (named after the screen name) and an index.js file which defines the redux properties and data that flows into the presentational component (see https://medium.com/@dan_abramov/smart-and-dumb-components-7ca2f9a7c7d0)

organized by flow...

#### Onboarding Flow

- Landing

- ChooseSplashtag

- EnterPhoneNumber

- VerifyPhoneNumber

#### Send Money Flow

- EnterAmount

- SendTo

- ScanQrCode.js

#### Main Swipe App

- SwipeApp

Container view for Account, Home, and Wallet screens. The shared header is defined in this folder.

- Account

- Home

- Wallet

#### Modals

- Modals

Defines modal containers and ModalRoot.js which allows for the modals to be called in a redux action.

- ApproveCardModal
- ApproveTransactionModal
- ViewTransactionModal

#### Security and Settings

- Unlock

- SetPasscode

- UpdateUsername

#### Other

- universal

Contains smaller components used across a variety of screens.

### lib

- colors.js
- cryptos.js
- styles.js

### redux

Each folder in redux has two files: reducer.js and actions.js. The latter utilizes to apis in combination with various states to call the appropriate redux action. The reducer file specifies an initial state and dictates the specific updates to state an action will fire.

- crypto
- onboarding
- transactions
- user
- modal.js
- payflow.js

### store

- configures redux state tracking as well
- Sentry middleware

### api.js

- interface for calling information from Splash database

### bitcoin-api.js

- Includes all bitcoin related api functions

### ethereuem-api.js

- Includes all ethereum related api functions

### index.js

- configures code push and sentry
- contains the router
- provides logic for login

### routes.js

- defines routing structure of the app
- configures screen transitions and options
