import Logger from 'electron-log/main'
import { trayService } from './TrayService'

export async function initService(): Promise<void> {
  trayService.init()

  Logger.info('init service')
}

export async function destroyServices(): Promise<void> {
  trayService.destroy()
  Logger.info('destroy service')
}
