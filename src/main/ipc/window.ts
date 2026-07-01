import { ipcMain } from 'electron'
import { IPC } from '@share/constants/ipc'
import { WIND_ID } from '@share/constants/index'
import { windowService } from '@main/services/WindowService'
import { isAdmin } from '@main/utils'

export function registerWindowIpc(): void {
  ipcMain.handle(IPC.WINDOW_GET_INFO, async (_event) => {
    const win = windowService.getByWebContents(_event.sender)
    return { id: win?.id || '' } as Global.WindowInfo
  })

  ipcMain.handle(IPC.WINDOW_OPEN, async (_event, id: string) => {
    await windowService.open(id)
  })

  ipcMain.handle(IPC.WINDOW_CLOSE, async (event) => {
    const win = windowService.getByWebContents(event.sender)
    if (win && !isAdmin(win)) {
      windowService.close(win.id)
      return
    }
    windowService.closeAll()
  })

  ipcMain.handle(IPC.WINDOW_DESTROY, async (event) => {
    const win = windowService.getByWebContents(event.sender)
    if (win && !isAdmin(win)) {
      windowService.destroyById(win.id)
      return
    }
    windowService.destroy()
  })

  ipcMain.handle(IPC.WINDOW_CLOSE_CANCEL, async (event) => {
    windowService.cancelClose(event.sender.id)
  })

  ipcMain.handle(IPC.WINDOW_OPEN_EXCLUSIVE, async (_event, id: string, exclusiveIds: string[]) => {
    return await windowService.openWithExclusive(id, exclusiveIds)
  })

  ipcMain.handle(IPC.WINDOW_GET_ALL_IDS, async () => {
    return WIND_ID
  })
}
