import { ipcRenderer } from 'electron'
import { IPC } from '@share/constants/ipc'

export default {
  encrypt: (plaintext: string) =>
    ipcRenderer.invoke(IPC.CRYPTO_ENCRYPT, plaintext) as Promise<{
      iv: string
      authTag: string
      ciphertext: string
    }>,
  decrypt: (encrypted: { iv: string; authTag: string; ciphertext: string }) =>
    ipcRenderer.invoke(IPC.CRYPTO_DECRYPT, encrypted) as Promise<string>
}
