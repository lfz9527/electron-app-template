import Logger from 'electron-log/main'

import { registerDialogIpc } from './dialog'
import { registerFileIpc } from './file'
import { registerStoreIpc } from './store'
import { registerWindowIpc } from './window'

export function registerIpc(): void {
  registerDialogIpc()
  registerFileIpc()
  registerStoreIpc()
  registerWindowIpc()

  Logger.info('register ipc')
}
