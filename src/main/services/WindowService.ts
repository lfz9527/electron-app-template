import { BaseWindow } from '../windows/BaseService'
import { mainWindow } from '@main/windows/MainWindow'
import type { IService } from './types'

export class WindowService implements IService {
  readonly name: string = 'windowService'
  private readonly windows = new Map<string, BaseWindow>()

  async init() {
    this.getMainWindow()?.create()
  }
  async destroy() {
    this.closeAll()
  }

  register(window: BaseWindow) {
    this.windows.set(window.id, window)
  }

  getMainWindow() {
    return this.get('main')
  }

  get(id: string) {
    return this.windows.get(id)
  }

  async open(id: string) {
    await this.windows.get(id)?.show()
  }

  close(id: string) {
    this.windows.get(id)?.close()
  }

  destroyById(id: string) {
    this.windows.get(id)?.destroy()
  }

  closeAll() {
    for (const window of this.windows.values()) {
      window.close()
    }
  }
}

export const windowService = new WindowService()

windowService.register(mainWindow)
