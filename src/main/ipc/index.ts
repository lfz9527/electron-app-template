import Logger from 'electron-log/main'

import { registerDialogIpc } from './dialog'
import { registerFileIpc } from './file'
import { registerStoreIpc } from './store'

export function registerIpc(): void {
  registerDialogIpc()
  registerFileIpc()
  registerStoreIpc()

  Logger.info('register ipc')
}
