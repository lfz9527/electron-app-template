import { BaseWindow } from './BaseService'
import { defaultOptions } from './utils'
import { WIND_ID, WIND_ROUTE } from '@share/constants/index'

export class LoginWindow extends BaseWindow {
  readonly id = WIND_ID.LOGIN

  readonly route = WIND_ROUTE.LOGIN

  protected getOptions() {
    return defaultOptions
  }
}

export const loginWindow = new LoginWindow()
