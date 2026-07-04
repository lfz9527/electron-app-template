import { ipcMain } from 'electron'
import { IPC } from '@share/constants/ipc'
import { encryptData, decryptData } from '@main/utils/crypto'

export function registerCryptoIpc(): void {
  ipcMain.handle(IPC.CRYPTO_ENCRYPT, (_event, plaintext: string) => {
    return encryptData(plaintext)
  })

  ipcMain.handle(
    IPC.CRYPTO_DECRYPT,
    (
      _event,
      encrypted: {
        iv: string
        authTag: string
        ciphertext: string
      }
    ) => {
      return decryptData(encrypted)
    }
  )
}
