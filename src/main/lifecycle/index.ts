import { app } from 'electron'
import Logger from 'electron-log/main'
import { destroyServices } from '@main/services'

export function setupLifecycle(): void {
  // 所有窗口关闭时，仅非 macOS 系统退出应用
  app.on('window-all-closed', () => {
    Logger.info('[lifecycle] window-all-closed')
    if (process.platform !== 'darwin') {
      app.quit()
    }
  })

  // 应用即将退出前的清理工作（阻止退出前的最后一站）
  app.on('before-quit', () => {
    Logger.info('[lifecycle] before-quit')
  })

  // 应用彻底退出时注销所有服务
  app.on('quit', () => {
    destroyServices()
    Logger.info('[lifecycle] quit → destroyed services')
  })

  // macOS dock 图标点击且无窗口时，重建主窗口
  app.on('activate', () => {
    Logger.info('[lifecycle] activate')
    // TODO: 搭配 WindowManager 重建主窗口
  })

  Logger.info('[lifecycle] setup complete')
}
