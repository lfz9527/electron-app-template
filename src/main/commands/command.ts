import { app, BrowserWindow } from 'electron'

/**
 * 为指定窗口注册 DevTools 相关命令
 * - 开发/测试环境自动打开 DevTools
 * - F12 切换 DevTools 打开/关闭
 */
export function registerDevToolsCommands(mainWindow: BrowserWindow): void {
  // 只在开发/测试环境下生效
  if (!app.isPackaged) {
    // 自动打开 DevTools
    mainWindow.webContents.openDevTools()

    // 监听 F12，切换 DevTools 打开/关闭
    mainWindow.webContents.on('before-input-event', (event, input) => {
      if (input.key === 'F12') {
        const opened = mainWindow.webContents.isDevToolsOpened()
        if (opened) {
          mainWindow.webContents.closeDevTools()
        } else {
          mainWindow.webContents.openDevTools()
        }
        event.preventDefault()
      }
    })
  }
}
