import { ipcMain, BrowserWindow } from 'electron'
import { IPC } from '@share/constants/ipc'
import { mainStore } from '@main/store/mainStore'

export function registerStoreIpc(): void {
  ipcMain.handle(IPC.STORE_GET, (_event, key: string) => {
    return mainStore.get(key)
  })

  ipcMain.handle(IPC.STORE_SET, (_event, key: string, value: unknown) => {
    mainStore.set(key, value)
    // 广播变更通知到所有渲染进程
    BrowserWindow.getAllWindows().forEach((win) => {
      win.webContents.send(IPC.STORE_CHANGED, key, value)
    })
  })
}
