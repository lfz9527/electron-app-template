import { ipcMain } from 'electron'
import { IPC } from '@share/constants/ipc'
import { getUserDataPath, getExePath, getTempPath } from '@main/utils'

export function registerPathIpc(): void {
  ipcMain.handle(IPC.PATHS_USER_DATA_PATH, async () => {
    return getUserDataPath()
  })

  ipcMain.handle(IPC.PATHS_EXE_PATH, async () => {
    return getExePath()
  })
  ipcMain.handle(IPC.PATHS_TEMP_PATH, async () => {
    return getTempPath()
  })
}
