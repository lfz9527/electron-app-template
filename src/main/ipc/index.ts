import Logger from 'electron-log/main'

import { registerDialogIpc } from './dialog'
import { registerFileIpc } from './file'

export function registerIpc(): void {
  registerDialogIpc()
  registerFileIpc()

  Logger.info('registerIpc')
}
