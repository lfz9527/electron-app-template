import { BaseWindow } from './BaseService'
import { defaultOptions } from './utils'

export class LoginWindow extends BaseWindow {
  readonly id = 'login'

  readonly route = '/login'

  protected getOptions() {
    return defaultOptions
  }
}

export const loginWindow = new LoginWindow()
