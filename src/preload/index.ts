import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'
import { IPC } from '@share/constants/ipc'

// 预加载脚本暴露出去的api
const api = {
  getWindowInfo: () => ipcRenderer.invoke(IPC.WINDOW_GET_INFO)
}

// 仅在开启**上下文隔离（context isolation）**的情况下，使用 contextBridge API 将 Electron API 暴露给渲染进程；
// 若未开启上下文隔离，直接挂载到 DOM 全局对象即可。
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('api', api)
  } catch (error) {
    console.error(error)
  }
} else {
  // @ts-ignore（类型声明已在 dts 文件中定义）
  window.electron = electronAPI
  // @ts-ignore（类型声明已在 dts 文件中定义）
  window.api = api
}
