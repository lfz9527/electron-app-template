import { BaseService } from './types'

class TrayService implements BaseService {
  async init() { }
  async destroy() { }
}

export const trayService = new TrayService()
