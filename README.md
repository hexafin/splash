# Setup

* Switch to node version 5><9 (e.g. v8.1.3). Use Node version manager (nvm) to quickly switch between node versions.
* `yarn`
* `cd ios && pod install`
* `mkdir env` --> copy keys.json file into `./env` (ask admin for file, not in repo)
* Add signing certificate in Xcode UI --> splash.xcworkspace --> general
* To start the project: `react-native run-ios`
  If it fails due to an `fsevents` error, run
  `npm r -g watchman brew install watchman`. It should fix it.

# Directory
Description and locations of relevant files

## ios
* Configuration of app icons and launch image assets
* integration of native packages with RN
* App facing settings

## src
### assets
* animations (JSON Lottie animations)
* fonts
* icons
* images

### components

each screen in the app is in the components folder. most are folders with the presentational component (named after the screen name) and an index.js file which defines the redux properties and data that flows into the presentational component (see https://medium.com/@dan_abramov/smart-and-dumb-components-7ca2f9a7c7d0)

organized by flow...

#### Onboarding Flow

* Landing

<p align="center">
  <img src="https://user-images.githubusercontent.com/11162612/51805655-1a88cb00-223e-11e9-8db0-f0e25fc9a7de.PNG" width="200">
</p>

* ChooseSplashtag

<p align="center">
  <img src="https://user-images.githubusercontent.com/11162612/51805663-1a88cb00-223e-11e9-8e0b-e13bbd97a73f.PNG" width="200">
</p>

* EnterPhoneNumber

<p align="center">
  <img src="https://user-images.githubusercontent.com/11162612/51805656-1a88cb00-223e-11e9-9967-684b6b4c912e.PNG" width="200">
</p>

* VerifyPhoneNumber

<p align="center">
  <img src="https://user-images.githubusercontent.com/11162612/51805657-1a88cb00-223e-11e9-8fe5-7847d20d741d.PNG" width="200">
</p>

#### Send Money Flow

* EnterAmount

<p align="center">
  <img src="https://user-images.githubusercontent.com/11162612/51805649-19f03480-223e-11e9-8d30-ee0b304040e1.PNG" width="200">
</p>

* SendTo

<p align="center">
  <img src="https://user-images.githubusercontent.com/11162612/51805669-1b216180-223e-11e9-8e47-7661cac3c964.PNG" width="200">
</p>

* ScanQrCode.js

<p align="center">
  <img src="https://user-images.githubusercontent.com/11162612/51805662-1a88cb00-223e-11e9-9f46-1852a4cf7c38.PNG" width="200">
</p>

#### Main Swipe App

* SwipeApp

Container view for Account, Home, and Wallet screens. The shared header is defined in this folder.

* Account

<p align="center">
  <img src="https://user-images.githubusercontent.com/11162612/51805647-19f03480-223e-11e9-8e19-b27efc659f09.PNG" width="200">
</p>

* Home

<p align="center">
  <img src="https://user-images.githubusercontent.com/11162612/51805654-1a88cb00-223e-11e9-9005-3616528af9b2.PNG" width="200">
</p>

* Wallet

<p align="center">
  <img src="https://user-images.githubusercontent.com/11162612/51805648-19f03480-223e-11e9-9065-8c1b8b6ade7b.PNG" width="200">
</p>

#### Modals

* Modals

Defines CardModal.js (left), RaiseModal.js (center), and InfoModal.js (Right) modal containers and ModalRoot.js which allows for the modals to be called in a redux action.

<p align="center">
  <img src="https://user-images.githubusercontent.com/11162612/51805652-19f03480-223e-11e9-9b03-8d764da7e403.PNG" width="200">
  <img src="https://user-images.githubusercontent.com/11162612/51805651-19f03480-223e-11e9-8a8c-c97d9ffed3b3.PNG" width="200">
  <img src="https://user-images.githubusercontent.com/11162612/51805670-1b216180-223e-11e9-9e38-aeb52c908690.PNG" width="200">
</p>

* ApproveCardModal
* ApproveTransactionModal

<p align="center">
  <img src="https://user-images.githubusercontent.com/11162612/51805651-19f03480-223e-11e9-8a8c-c97d9ffed3b3.PNG" width="200">
</p>

* ViewTransactionModal

<p align="center">
  <img src="https://user-images.githubusercontent.com/11162612/51805652-19f03480-223e-11e9-9b03-8d764da7e403.PNG" width="200">
</p>

#### Security and Settings

* Unlock

<p align="center">
  <img src="https://user-images.githubusercontent.com/11162612/51805661-1a88cb00-223e-11e9-9318-b960881a909f.PNG" width="200">
</p>

* SetPasscode

<p align="center">
  <img src="https://user-images.githubusercontent.com/11162612/51805870-cb906500-2240-11e9-83c7-e82fca37625d.PNG" width="200">
</p>

* UpdateUsername

<p align="center">
  <img src="https://user-images.githubusercontent.com/11162612/51805658-1a88cb00-223e-11e9-8fae-2cb6bb842b7e.PNG" width="200">
</p>

#### Other

* universal

Contains smaller components used across a variety of screens.


### lib
* colors.js
* cryptos.js
* styles.js

### redux
Each folder in redux has two files: reducer.js and actions.js. The latter utilizes to apis in combination with various states to call the appropriate redux action. The reducer file specifies an initial state and dictates the specific updates to state an action will fire.
* crypto
* onboarding
* transactions
* user
* modal.js
* payflow.js

### store
* configures redux state tracking as well
* Sentry middleware

### api.js
* interface for calling information from Splash database

### bitcoin-api.js
* Includes all bitcoin related api functions

### ethereuem-api.js
* Includes all ethereum related api functions

### index.js
* configures code push and sentry
* contains the router
* provides logic for login

### routes.js
* defines routing structure of the app
* configures screen transitions and options
