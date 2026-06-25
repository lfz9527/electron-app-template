import Logger from 'electron-log/main'

import { setupLifecycle } from './lifecycle'

async function initService(): Promise<void> {
  Logger.info('init service')
}

function registerIpc(): void {
  Logger.info('registerIpc')
}

export async function bootstrap(): Promise<void> {
  // 初始化生命周期
  setupLifecycle()
  // 注册ipc
  registerIpc()
  // 初始化服务
  initService()
}
