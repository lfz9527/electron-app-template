import { app } from 'electron'
import log from 'electron-log/main'

// 初始化日志
function setupLogger(): void {
  log.initialize()

  log.transports.file.level = 'info'
  // 未打包时控制台打印日志（dev + preview）
  log.transports.console.level = app.isPackaged ? false : 'info'

  log.info('Logger initialized')
}

export async function setupGlobalErrorHandler(): Promise<void> {
  setupLogger()

  // 未捕获同步异常
  process.on('uncaughtException', (error) => {
    log.error('[uncaughtException]', error)
  })

  // 未处理 Promise 异常
  process.on('unhandledRejection', (reason) => {
    log.error('[unhandledRejection]', reason)
  })

  // Node Warning
  process.on('warning', (warning) => {
    log.warn('[warning]', warning)
  })
}
