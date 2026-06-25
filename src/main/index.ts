import { app } from 'electron'
import { setupGlobalErrorHandler } from './core/error'
import { bootstrap } from './bootstrap'

async function start(): Promise<void> {
  try {
    // 全局异常处理
    setupGlobalErrorHandler()

    // 等待 Electron 准备完成
    await app.whenReady()

    // 启动应用
    await bootstrap()
  } catch (error) {
    console.error('[main] failed to start', error)

    app.quit()
  }
}

void start()
