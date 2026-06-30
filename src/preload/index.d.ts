import { ElectronAPI } from '@electron-toolkit/preload'

declare global {
  interface Window {
    electron: ElectronAPI
    api: {
      getWindowInfo: () => Promise<Global.WindowInfo>
    }
  }
}
