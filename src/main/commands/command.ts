import { BrowserWindow } from 'electron'
import { is } from '@electron-toolkit/utils'
/**
 * 关闭DevTools
 * @param win BrowserWindow
 */
export function closeDevTools(win: BrowserWindow): void {
  win.webContents.closeDevTools()
}

/**
 * 打开DevTools
 * @param win BrowserWindow
 */
export function openDevTools(win: BrowserWindow): void {
  win.webContents.openDevTools()
}

/**
 * 为指定窗口注册 DevTools 相关命令
 * - 开发/测试环境自动打开 DevTools
 * - F12 切换 DevTools 打开/关闭
 */
export function registerDevToolsCommands(window: BrowserWindow): void {
  // 只在开发/测试环境下生效
  if (!is.dev) return

  // 自动打开 DevTools
  openDevTools(window)

  // 监听 F12，切换 DevTools 打开/关闭
  window.webContents.on('before-input-event', (event, input) => {
    if (input.key === 'F12') {
      const opened = window.webContents.isDevToolsOpened()
      if (opened) {
        closeDevTools(window)
      } else {
        openDevTools(window)
      }
      event.preventDefault()
    }
  })
}
