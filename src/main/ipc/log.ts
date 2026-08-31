import { ipcMain } from 'electron'
import { readFile, copyFile } from 'fs/promises'
import { IPC } from '@share/constants/ipc'
import { formatLogFileName } from '@main/core/error'

export function registerLogIpc(): void {
  // 读取应用日志内容
  ipcMain.handle(IPC.LOG_READ, async () => {
    try {
      return await readFile(formatLogFileName(), 'utf-8')
    } catch {
      // 日志文件尚未生成时返回空字符串
      return ''
    }
  })

  // 导出应用日志：将当天日志复制到外部传入的路径
  ipcMain.handle(IPC.LOG_EXPORT, async (_event, targetPath: string) => {
    try {
      await copyFile(formatLogFileName(), targetPath)
      return true
    } catch {
      // 日志文件尚不存在或复制失败时返回 false
      return false
    }
  })
}
