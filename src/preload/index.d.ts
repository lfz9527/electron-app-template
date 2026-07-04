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
      closeCancel: () => Promise<void>
      openWindowExclusive: (id: string, exclusiveIds: string[]) => Promise<boolean>
      getWindowIds: () => Promise<typeof import('@share/constants/index').WIND_ID>
      encrypt: (plaintext: string) => Promise<{
        iv: string
        authTag: string
        ciphertext: string
      }>
      decrypt: (encrypted: { iv: string; authTag: string; ciphertext: string }) => Promise<string>
    }
  }
}
