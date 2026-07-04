import Logger from 'electron-log/main'

import { registerDialogIpc } from './dialog'
import { registerFileIpc } from './file'
import { registerStoreIpc } from './store'
import { registerWindowIpc } from './window'
import { registerCryptoIpc } from './crypto'

export function registerIpc(): void {
  registerDialogIpc()
  registerFileIpc()
  registerStoreIpc()
  registerWindowIpc()
  registerCryptoIpc()

  Logger.info('register ipc')
}
