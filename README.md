# App-isfit-23

## Running the application

First time? You will be asked to sign into [EAS account (Expo)](https://expo.dev/signup).

```
npx expo
```

When expo runs correctly it will give you multiple options to look at the app. [Here are some ways to simulate the app](#setup-simulators).

[You can also encounter some problems with expo](#fix-expo).

## Setup of repo

1. **Clone the repository**

   Clone using the terminal

   ```
   git clone https://github.com/isfit/App-isfit-23.git
   ```

   or clone directly in your IDE.

2. **Install dependencies**

   After installing dependecies, try to run the application. Step 3 and 4 might not be necessary to do.

   ```
   npm install
   ```

   or

   ```
   yarn install
   ```

3. **Install watchman**

   ```
    brew install watchman
   ```

4. **Install expo**
   ```
   npx install-expo-modules@latest
   ```

## Setup simulators

### iOS

Press i │ open iOS simulator

1. Install Xcode

2. Go to Locations in Settings

3. Choose the newest version of Command Line Tools (Might already be selected, and you just need to click it once more).

![Image of xcode settings](/src/assets/SetupGuide/xcodeSettingsLocations.png)

### Android

Press a │ open Android

- Information to be added.

### Web

Press w │ open web

## Fix expo

Listed are known issues or bugs with expo and how to fix them.

**Incompatible dependencies**

Might need to use "sudo" on mac.

```
npx expo-doctor
```

## About package update 09/2024

The old repo was outdated and it was necessary to update the packages. E.g., `This project is using an SDK version that by default targets Android API level 33 or lower. To submit your app to the Google Play Store after August 31 2024, you must target Android API level 34 or hig Advice: Upgrade to Expo SDK 50 or later, which by default supports Android API level 34.`

The app is now updated to the latest version of Expo, i.e., ^51.0.34. Unfortunately, this Expo version does not support the newest versions of the react-packages. Therefore, be cautious and check with the Expo version if wanting to update react or other packages.
