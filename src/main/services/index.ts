import { trayService } from './TrayService'
import { windowService } from './WindowService'
import type { IService } from './types'
import Logger from 'electron-log/main'

export class ServiceManager {
  private readonly services: IService[] = []

  register(service: IService) {
    this.services.push(service)
  }

  async init() {
    for (const service of this.services) {
      Logger.info(`Init Service: ${service.name}`)
      await service.init()
    }
  }

  async destroy() {
    for (const service of [...this.services].reverse()) {
      Logger.info(`Destroy ${service.name} Service`)
      await service.destroy()
    }
  }
}

export const serviceManager = new ServiceManager()

serviceManager.register(trayService)
serviceManager.register(windowService)
