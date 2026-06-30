import { setupLifecycle } from './lifecycle'
import { registerIpc } from './ipc'
import { serviceManager } from './services'

export async function bootstrap(): Promise<void> {
  // 初始化生命周期
  setupLifecycle()
  // 注册ipc
  registerIpc()
  // 初始化服务
  await serviceManager.init()
}
