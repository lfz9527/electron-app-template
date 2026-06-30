import { ipcMain } from 'electron'
import { IPC } from '@share/constants/ipc'
import { windowService } from '@main/services/WindowService'

export function registerWindowIpc(): void {
  ipcMain.handle(IPC.WINDOW_GET_INFO, async (_event) => {
    const win = windowService.getByWebContents(_event.sender)
    return { id: win?.id || '' } as Global.WindowInfo
  })
}
