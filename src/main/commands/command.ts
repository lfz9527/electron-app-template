import { BrowserWindow } from 'electron'
import { isBuild } from '@main/utils'

/**
 * 为指定窗口注册 DevTools 相关命令
 * - 开发/测试环境自动打开 DevTools
 * - F12 切换 DevTools 打开/关闭
 */
export function registerDevToolsCommands(window: BrowserWindow): void {
  // 只在开发/测试环境下生效
  if (isBuild()) return

  // 自动打开 DevTools
  window.webContents.openDevTools()

  // 监听 F12，切换 DevTools 打开/关闭
  window.webContents.on('before-input-event', (event, input) => {
    if (input.key === 'F12') {
      const opened = window.webContents.isDevToolsOpened()
      if (opened) {
        window.webContents.closeDevTools()
      } else {
        window.webContents.openDevTools()
      }
      event.preventDefault()
    }
  })
}
