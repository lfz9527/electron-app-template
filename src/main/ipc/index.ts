import Logger from 'electron-log/main'

import { registerDialogIpc } from './dialog'
import { registerFileIpc } from './file'
import { registerStoreIpc } from './store'
import { registerWindowIpc } from './window'
import { registerCryptoIpc } from './crypto'
import { registerLogIpc } from './log'

export function registerIpc(): void {
  registerDialogIpc()
  registerFileIpc()
  registerStoreIpc()
  registerWindowIpc()
  registerCryptoIpc()
  registerLogIpc()

  Logger.info('register ipc')
}
