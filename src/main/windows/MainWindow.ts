import { BaseWindow } from './BaseService'
import { join } from 'path'
import { is } from '@electron-toolkit/utils'
import { defaultOptions } from './utils'

export class MainWindow extends BaseWindow {
  readonly id = 'main'

  protected getOptions() {
    return defaultOptions
  }

  protected async load(): Promise<void> {
    // 开发模式加载 dev server，生产模式加载打包后的文件
    if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
      this.window!.loadURL(process.env['ELECTRON_RENDERER_URL'])
    } else {
      this.window!.loadFile(join(__dirname, '../renderer/index.html'))
    }
  }
}

export const mainWindow = new MainWindow()
