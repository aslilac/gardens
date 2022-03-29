// ```Shell
// npx electron bad_tests/electron.js
// ```

// First we set up the browser window.
const { app, BrowserWindow } = require("electron");
const path = require("path");
const url = require("url");

let view = null;

function createWindow() {
	// Create the browser window.
	view = new BrowserWindow({
		width: 1500,
		height: 900,
		show: false,
		titleBarStyle: "hiddenInset",
		autoHideMenuBar: true,
		webPreferences: {
			nodeIntegration: true,
		},
	});

	// Load the app.
	view.loadURL(
		url.format({
			pathname: path.join(__dirname, "index.html"),
			protocol: "file:",
			slashes: true,
		}),
	);

	// Prevent seeing an unpopulated screen.
	view.on("ready-to-show", () => {
		view.show();
		view.openDevTools();
	});

	// Emitted when the window is closed.
	view.on("closed", () => {
		// Dereference the window object, so that Electron can close gracefully
		view = null;
	});
}

// Launch on startup.
app.on("ready", () => {
	createWindow();
});

app.on("window-all-closed", () => {
	app.quit();
});

// Now we run garden tests in the main process.
// All we have to do is import them. They run automatically.
require(".");
