import { contextBridge } from 'electron'

// Minimal preload - just expose electron API
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', {})
  } catch (error) {
    console.error(error)
  }
}
