import { ElectronAPI } from '@electron-toolkit/preload'

declare global {
  interface Window {
    electron: ElectronAPI
    api: {
      getWindowInfo: () => Promise<Global.WindowInfo>
      openWindow: (id: string) => Promise<void>
      onBeforeClose: (callback: () => void) => void
      winClose: () => Promise<void>
      winDestroy: () => Promise<void>
    }
  }
}
