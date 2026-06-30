import { BaseWindow } from './BaseService'

import { defaultOptions } from './utils'

export class MainWindow extends BaseWindow {
  readonly id = 'main'

  protected getOptions() {
    return defaultOptions
  }

  protected async loadUrl(): Promise<void> {
    await this.load()
  }
}

export const mainWindow = new MainWindow()
