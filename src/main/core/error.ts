import path from 'node:path'
import log from 'electron-log/main'
import { getUserDataPath } from '@main/utils'

// 按日期命名日志文件（logs/yyyy-MM-dd.log）
export function formatLogFileName() {
  const now = new Date()
  const date = [
    now.getFullYear(),
    String(now.getMonth() + 1).padStart(2, '0'),
    String(now.getDate()).padStart(2, '0')
  ].join('-')
  return path.join(getUserDataPath(), 'logs', `${date}.log`)
}

// 初始化日志
function setupLogger(): void {
  log.initialize()

  log.transports.file.resolvePathFn = () => formatLogFileName()

  log.transports.file.level = 'info'
  // 控制台只打印 error 级别日志
  log.transports.console.level = 'error'

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
