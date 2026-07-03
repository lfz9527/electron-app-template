import { ipcRenderer } from 'electron'
import { IPC } from '@share/constants/ipc'
import { WIND_ID } from '@share/constants/index'

export default {
  getWindowInfo: () => ipcRenderer.invoke(IPC.WINDOW_GET_INFO),
  openWindow: (id: string) => ipcRenderer.invoke(IPC.WINDOW_OPEN, id),
  onBeforeClose: (callback: () => void) => {
    ipcRenderer.on(IPC.WINDOW_BEFORE_CLOSE, callback)
  },
  winClose: () => ipcRenderer.invoke(IPC.WINDOW_CLOSE),
  winDestroy: () => ipcRenderer.invoke(IPC.WINDOW_DESTROY),
  closeCancel: () => ipcRenderer.invoke(IPC.WINDOW_CLOSE_CANCEL),
  openWindowExclusive: (id: string, exclusiveIds: string[]) =>
    ipcRenderer.invoke(IPC.WINDOW_OPEN_EXCLUSIVE, id, exclusiveIds),
  getWindowIds: () => ipcRenderer.invoke(IPC.WINDOW_GET_ALL_IDS) as Promise<typeof WIND_ID>
}
