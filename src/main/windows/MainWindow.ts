import { BaseWindow } from './BaseService'
import { defaultOptions } from './utils'
import { WIND_ID } from '@share/constants/index'

export class MainWindow extends BaseWindow {
  readonly id = WIND_ID.ADMIN

  protected getOptions() {
    return defaultOptions
  }

  protected async loadUrl(): Promise<void> {
    await this.load()
  }
}

export const mainWindow = new MainWindow()
