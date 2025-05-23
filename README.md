# nestris.org-commentator

A browser extension for [nestris.org](https://nestris.org) that provides generated commentary for 2-player battles via text-to-speech.

## Chrome

### Installation in Chrome

This extension is in beta, so you will need to enable "Developer mode" to install it. To install the extension into Chrome from a release:

1. Download the `nestris.org-commentator.crx` file from the [latest Chrome release](https://github.com/roncli/nestris.org-commentator/releases).
2. Open Chrome and navigate to `chrome://extensions/`.
3. Enable "Developer mode" using the toggle in the top-right corner.
4. Drag and drop the `nestris.org-commentator.crx` file onto the extensions page.
5. Confirm the installation when prompted.

### Development Setup in Chrome

To set up the project for development in Chrome:

1. Clone the repository to your local machine.
2. Navigate to the `chrome` directory.
3. Install the required dependencies by running:
   ```bash
   npm install
   ```
4. Open Chrome and navigate to `chrome://extensions/`.
5. Enable "Developer mode" using the toggle in the top-right corner.
6. Click "Load unpacked" and select the `dist` directory of the project.

## Firefox

### Installation in Firefox

Once installed, the Firefox extension will auto-update when a new version is released.

1. Download the `nestris.org-commentator.xpi` file from the [latest Firefox release](https://github.com/roncli/nestris.org-commentator/releases).
2. Open the downloaded file.  If prompted, run it in Firefox.
3. Confirm the installation when prompted.

### Development Setup in Firefox

To set up the project for development in Firefox:

1. Clone the repository to your local machine.
2. Navigate to the `firefox` directory.
3. Install the required dependencies by running:
   ```bash
   npm install
   ```
4. Open Firefox and navigate to `about:addons`.
5. Click the gear icon and select "Debug Addons".
6. Click the "Load Temporary Add-on" button.
7. Find the manifest.json file in the directory from step 2 and open it.

## Version History

### v0.2.0 - 5/4/2025
* Firefox extension.

### v0.2.0 - 5/3/2025
* Improved talking about numbers for numbers that are read in their entirety.
* No longer will occasionally think the board is clean right as a player tops out.
* Halfway point no longer called out when joining a game in progress.
* Fixed typo for "opponent".
* Introductions are announced quicker.
* Various other fixes and error handling.

### v0.1.0 - 4/27/2025
* Initial release.
