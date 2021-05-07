const { app, BrowserWindow } = require("electron");
const { join } = require("path");

function create() {
    let win = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
        },
        icon: join(__dirname, "public", "icon.ico"),
        title: "Basic-DB Panel",
    });
    win.loadFile(join(__dirname, "www", "index.html"));
}

app.whenReady().then(() => {
    create();
    app.on("activate", () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            create();
        }
    });
});

app.on("window-all-closed", () => {
    if (process.platform !== "darwin") {
        app.quit();
    }
});
