import { app, BrowserWindow } from 'electron'
import { join } from 'path'
import icon from '../../resources/icon.png?asset'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'

function createWindow() {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 1200,
    height: 900,
    show: false,
    autoHideMenuBar: true,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false,
      contextIsolation: true
    },
    resizable: true
  })

  // Maximize the window to take up as much space as possible
  mainWindow.maximize()

  // Show the window once it's ready
  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  // Open DevTools in dev
  if (is.dev) {
    mainWindow.webContents.openDevTools()
  }

  // Load the main page
  const rendererUrl = process.env['ELECTRON_RENDERER_URL']
  console.log('is.dev:', is.dev)
  console.log('ELECTRON_RENDERER_URL:', rendererUrl)
  
  if (is.dev && rendererUrl) {
    console.log('Loading dev URL:', rendererUrl)
    mainWindow.loadURL(rendererUrl)
  } else {
    const filePath = join(__dirname, '../renderer/index.html')
    console.log('Loading file:', filePath)
    mainWindow.loadFile(filePath)
  }
}

// This method will be called when Electron has finished initialization.
app.whenReady().then(() => {
  // Set app user model id for windows
  electronApp.setAppUserModelId('com.electron')

  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  // Create the main window
  createWindow()

  app.on('activate', function () {
    // On macOS, re-create a window if none are open
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Quit when all windows are closed, except on macOS.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
