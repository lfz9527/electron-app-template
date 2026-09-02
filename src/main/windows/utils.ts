import { join } from 'path'
import { BrowserWindowConstructorOptions, app } from 'electron'

export const defaultOptions: BrowserWindowConstructorOptions = {
  show: true,
  width: 900,
  height: 670,
  autoHideMenuBar: true,
  webPreferences: {
    // 打包后不能通过快捷键打开调试台
    devTools: !app.isPackaged,
    // 不要让 页面拥有完整 Node.js 权限
    nodeIntegration: false,
    // 渲染进程和Electron API 隔离上下文
    contextIsolation: true,
    // 很多社区开发库，需要sandbox 关闭
    sandbox: false,
    // 使用预加载脚本，保留主线程的api
    preload: join(__dirname, '../preload/index.js')
  }
}
