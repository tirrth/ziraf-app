# ZirafApp
Trustworthy food recommendation app

### Tech
* [React Native](https://facebook.github.io/react-native/) - Build native mobile apps using JavaScript and React

### Installation

ZirafApp requires [Node.js](https://nodejs.org/) v8+ to run.

Install React Native command line interface
```sh
npm install -g react-native-cli
```
Require Xcode to run on iOS simulator
Require Android Studio to run on Android emulator

Install the dependencies and devDependencies

```sh
$ cd ZirafApp
$ npm install
```

Install cocoapods - https://cocoapods.org/ : dependency manager for Swift and Objective-C

Install pods
```sh
$ cd ios
$ pod install
```
To build and run on iOS simulator
```sh
$ react-native run-ios
```

To build android
```sh
$ react-native link
$ npx jetify
```

To build and run on android emulator
```sh
$ react-native run-android
```
