import { setupLifecycle } from './lifecycle'
import { createMainWindow } from './windows/MainWindow'
import { registerDevToolsCommands } from './commands/command'
import { registerIpc } from './ipc'
import { initService } from './services'

export async function bootstrap(): Promise<void> {
  // 初始化生命周期
  setupLifecycle()
  // 注册ipc
  registerIpc()
  // 初始化服务
  initService()

  // 创建主窗口
  const mainWindow = createMainWindow()
  // 注册 DevTools 命令（开发环境自动打开 + F12 切换）
  registerDevToolsCommands(mainWindow)
}
