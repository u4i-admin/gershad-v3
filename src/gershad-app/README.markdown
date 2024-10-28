# gershad-app

Gershad app. Powered by [Next.js](https://nextjs.org) and [Capacitor](https://capacitorjs.com) .

- [Resources](#resources)
- [Browser](#browser)
  - [Prerequisites](#prerequisites)
  - [Start development server](#start-development-server)
  - [Build into `out` directory](#build-into-out-directory)
- [Android](#android)
  - [Prerequisites](#prerequisites-1)
  - [Increasing app version number](#increasing-app-version-number)
  - [Build and start debug version](#build-and-start-debug-version)
    - [With dev UI build](#with-dev-ui-build)
    - [With prod UI build](#with-prod-ui-build)
- [iOS](#ios)
  - [Prerequisites](#prerequisites-2)
  - [Managing Xcode versions](#managing-xcode-versions)
  - [Apple Developer Certificates](#apple-developer-certificates)
  - [Increasing app version number](#increasing-app-version-number-1)
  - [Build and start debug version](#build-and-start-debug-version-1)
    - [With dev UI build](#with-dev-ui-build-1)
    - [With prod UI build](#with-prod-ui-build-1)
  - [Distributing to the App Store](#distributing-to-the-app-store)
- [Run tests](#run-tests)
- [Environment variables](#environment-variables)
- [Generate icons](#generate-icons)
- [Guidelines](#guidelines)
  - [VS Code](#vs-code)
  - [TypeScript](#typescript)
  - [Styling](#styling)
  - [ESLint](#eslint)
  - [Prettier](#prettier)

## Resources

- [Website](https://gershad.com/)

## Browser

### Prerequisites

- You must have the proper [environment variables](#environment-variables) set in your shell. In development you’ll want to copy `.env.local.template` into `.env.local` and customize the values as needed.

- You need Node.js 18.x installed and in the shell’s PATH.

### Start development server

```sh
npm install
npm run dev
```

### Build into `out` directory

```sh
npm install
npm dev-build-export-serve
```

## Android

### Prerequisites

In addition to the [shared prerequisites](#prerequisites):

- [Android Studio](https://developer.android.com/studio) (once installed `~/Library/Android/sdk` should exist)
- Gradle 7+ (`brew install gradle`)
- For native testing: connected Android device with [developer options enabled](https://developer.android.com/studio/debug/dev-options#enable) and [USB debugging enabled](https://developer.android.com/studio/debug/dev-options#Enable-debugging)

If you have any Java configuration (e.g. `JAVA_HOME` or Java-specific `PATH` overrides) in your shell configuration (e.g. `.config/fish/fish.config` or `.zshrc`) you should remove/comment it to avoid conflicts with our auto-loaded environment config (`.env.macos-dev-android`).

### Increasing app version number

To increase the Android app version number open `android/app/build.gradle` and edit the `android.defaultConfig.versionCode` (exposed as [`AppInfo.build`][android-AppInfo]) and `android.defaultConfig.versionName` (exposed as [`AppInfo.version`][android-AppInfo]) properties.

[android-AppInfo]: https://capacitorjs.com/docs/apis/app#appinfo

### Build and start debug version

These commands will prompt you to choose a target device. To automatically install and run on a specific device ID set `CAPACITOR_ANDROID_TARGET_DEVICE_ID` in `.env.local`.

#### With dev UI build

This is the recommended way to run the site in development since it enables [React Fast Refresh][nextjs-react-fast-refresh]:

```sh
npm run dev-android
```

#### With prod UI build

This builds a standalone UI using the same configuration used in prod, but takes longer and doesn’t support [React Fast Refresh][nextjs-react-fast-refresh].

```sh
npm run dev-android-build-export-run
```

## iOS

### Prerequisites

In addition to the [shared prerequisites](#prerequisites):

- [Xcode 14.2+](https://xcodereleases.com) (must be located at `/Applications/Xcode.app`)
- Xcode command line tools (`xcode-select --install`; almost definitely already installed if you’ve done any other development on this machine!)

### Managing Xcode versions

**Currently (2023-02-07) this isn’t necessary!** In the future it will likely be necessary to either hold off on updating Xcode, or keep an older version installed in order to build since Xcode versions are tied to specific Swift versions.

In this scenario, install the latest version of Xcode to `/Applications/Xcode.app`, and rename the older version to e.g. `/Applications/Xcode 14.2.app`. Then to use the older version of Xcode for builds (and as the default app for `.xcodeproj` and `.xcodeworkspace` files) run:

```sh
sudo xcode-select -s "/Applications/Xcode 14.2.app/Contents/Developer"
```

Or to return to using `Xcode.app`:

```sh
sudo xcode-select -s "/Applications/Xcode.app/Contents/Developer"
```

(See `man xcode-select` for more details.)

### Apple Developer Certificates

Running the iOS and macOS apps requires an Apple Development certificate in the “ASL19 Inc.” team. Xcode should automatically generate this if you have your ASL19 Apple Developer account set up in Xcode → Preferences → Accounts.

(If you don’t already have a ASL19 Apple Developer account ask Grant.)

### Increasing app version number

To increase the iOS app version number open `ios/App/App.xcworkspace` in Xcode, click "App" in the sidebar to open the visual `App.xcodeproj` editor, navigate to the "General" tab, and edit the "Identity" section:

- **Version**: saved as `project.pbxproj`’s [`MARKETING_VERSION`][ios-MARKETING_VERSION], referenced in `Info.plist`’s [`CFBundleShortVersionString`][ios-CFBundleShortVersionString], exposed as [`AppInfo.version`][ios-AppInfo]
- **Build**: saved as `project.pbxproj`’s [`CURRENT_PROJECT_VERSION`][ios-CURRENT_PROJECT_VERSION], referenced in `Info.plist`’s [`CFBundleVersion`][ios-CFBundleVersion], exposed as [`AppInfo.build`][ios-AppInfo]

[ios-AppInfo]: https://capacitorjs.com/docs/apis/app#appinfo
[ios-CFBundleShortVersionString]: https://developer.apple.com/documentation/bundleresources/information_property_list/cfbundleshortversionstring
[ios-CFBundleVersion]: https://developer.apple.com/documentation/bundleresources/information_property_list/cfbundleversion
[ios-CURRENT_PROJECT_VERSION]: https://developer.apple.com/documentation/xcode/build-settings-reference#Current-Project-Version
[ios-MARKETING_VERSION]: https://developer.apple.com/documentation/xcode/build-settings-reference#Marketing-Version

### Build and start debug version

These commands will prompt you to choose a target device. To automatically install and run on a specific device ID set `CAPACITOR_IOS_TARGET_DEVICE_ID` in `.env.local`.

#### With dev UI build

This is the recommended way to run the site in development since it enables [React Fast Refresh][nextjs-react-fast-refresh]:

```sh
npm run dev-ios
```

#### With prod UI build

This builds a standalone UI using the same configuration used in prod, but takes longer and doesn’t support [React Fast Refresh][nextjs-react-fast-refresh].

```sh
npm run dev-ios-build-export-run
```

### Distributing to the App Store

1. **Ensure that the app is a release build built with environment variable values appropriate for production! (ask if you’re not sure)**
2. Product → Clean Build Folder (⇧⌘K)
3. Product → Build (⌘B)
4. Product → Archive
5. Click the “Distribute” button, and select “App Store Connect”

## Run tests

```bash
npm install
npm run dev-lint-test
```

[nextjs-react-fast-refresh]: https://nextjs.org/docs/basic-features/fast-refresh

## Environment variables

Environment variables are documented in [gershad-env.d.ts][env-vars-gershad-env].

For local development we recommend copying [`.env.local.template`][env-vars-env-local-template] to `.env.local` and modifying the contents as needed. The content of `.env.local` will be automatically loaded when the site builds.

When testing the site on a device it can help to temporarily change `NEXT_PUBLIC_WEB_URL` to your local IP so e.g. the manifest file URLs resolve correctly:

```sh
NEXT_PUBLIC_WEB_URL="http://192.168.1.23:3000"
```

But keep in mind that this will break things if you change networks or your local dynamic IP changes.

**Note**: Any variable beginning with [`NEXT_PUBLIC_`][env-vars-next-public] is exposed in front-end JS files, so must not include any private passwords, URLs, or keys!

[env-vars-env-local-template]: ./.env.local.template
[env-vars-gershad-env]: ./gershad-env.d.ts
[env-vars-next-public]: https://nextjs.org/docs/basic-features/environment-variables#exposing-environment-variables-to-the-browser

## Generate icons

Add the Android icon to `assets/icon-android.svg` and iOS icon to `assets/icon-ios.png`; then run:

```sh
npm run capacitor-assets-generate
```

## Guidelines

### VS Code

VS Code is strongly recommended for developing this project. If you open the `src/gershad-app` directory in VS Code it will load the bundled [settings file](.vscode/settings.json), which includes most the configuration described in the project guidelines.

You’ll want to install the following extensions:

- [Code Spell Checker][vs-code-code-spell-cheker]: Spell-checks code and comments (dictionary in [VS Code settings file](.vscode/settings.json))
- [ESLint][vs-code-eslint]: Highlights and auto-fixes ESLint issues in JavaScript and TypeScript files
- [Prettier][vs-code-prettier]: Auto-formats JSON and GraphQL files (JavaScript and TypeScript files are formatted using eslint-plugin-prettier)
- [styled-components][vs-code-styled-components]: Provides syntax highlighting and IntelliSense for CSS in `css` blocks

[vs-code-eslint]: https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint
[vs-code-prettier]: https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode
[vs-code-styled-components]: https://marketplace.visualstudio.com/items?itemName=jpoissonnier.vscode-styled-components
[vs-code-code-spell-cheker]: https://marketplace.visualstudio.com/items?itemName=streetsidesoftware.code-spell-checker

### TypeScript

The project is designed to work with the TypeScript compiler version specified in package.json.

If you’re using VS Code, use the “Select TypeScript Version…” command and select “Use Workspace Version”.

### Styling

All styling is done using [Emotion][emotion].

[emotion]: https://emotion.sh/

### ESLint

The project includes an ESLint configuration. You can run ESLint using `npm run eslint`, and auto-fix issues using `npm run eslint -- --fix` (be careful with this — stash any important changes!).

ESLint rules are enforced in the CI/CD system — changes can’t be merged if there are any warnings or errors.

### Prettier

All code is formatted using [Prettier](https://prettier.io).

For JavaScript and TypeScript files, Prettier is run via[eslint-plugin-prettier](https://github.com/prettier/eslint-plugin-prettier) to avoid the complexity of running multiple code formatters on save.

For JSON and GraphQL files, Prettier is run using the [VS Code Prettier extension][vs-code-prettier].

The bundled VS Code settings files includes this configuration.
