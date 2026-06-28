import { ipcMain } from 'electron'
import { readFile, writeFile } from 'fs/promises'
import { IPC } from '@common/constants/ipc'

export function registerFileIpc(): void {
  // 读取文件内容（UTF-8）
  ipcMain.handle(IPC.FILE_READ, async (_event, filePath: string) => {
    return readFile(filePath, 'utf-8')
  })

  // 写入文件内容（UTF-8）
  ipcMain.handle(IPC.FILE_WRITE, async (_event, filePath: string, content: string) => {
    await writeFile(filePath, content, 'utf-8')
    return true
  })
}
