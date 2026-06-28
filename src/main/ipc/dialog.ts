import { dialog, ipcMain } from 'electron'
import { IPC } from '@common/constants/ipc'

export function registerDialogIpc(): void {
  // 打开文件对话框
  ipcMain.handle(IPC.DIALOG_OPEN_FILE, async () => {
    const result = await dialog.showOpenDialog({
      properties: ['openFile']
    })
    return result.canceled ? null : result.filePaths[0]
  })

  // 保存文件对话框
  ipcMain.handle(IPC.DIALOG_SAVE_FILE, async () => {
    const result = await dialog.showSaveDialog({})
    return result.canceled ? null : result.filePath
  })
}
