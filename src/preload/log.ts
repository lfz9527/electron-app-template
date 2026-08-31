import { ipcRenderer } from 'electron'
import { IPC } from '@share/constants/ipc'

export default {
  // 读取应用日志内容
  readLog: () => ipcRenderer.invoke(IPC.LOG_READ) as Promise<string>,
  // 导出应用日志，将日志复制到目标路径，返回是否成功
  exportLog: (targetPath: string) =>
    ipcRenderer.invoke(IPC.LOG_EXPORT, targetPath) as Promise<boolean>
}
