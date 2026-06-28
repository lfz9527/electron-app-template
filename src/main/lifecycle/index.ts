import { app } from 'electron'
import Logger from 'electron-log/main'

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

  // 应用退出时执行最终清理
  app.on('quit', () => {
    Logger.info('[lifecycle] quit → final cleanup')
    // TODO: 清除临时文件、停止后台服务等
  })

  // macOS dock 图标点击且无窗口时，重建主窗口
  app.on('activate', () => {
    Logger.info('[lifecycle] activate')
    // TODO: 搭配 WindowManager 重建主窗口
  })

  Logger.info('[lifecycle] setup complete')
}
