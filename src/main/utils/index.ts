import { BaseWindow } from '@main/windows/BaseService'
import { WIND_ID } from '@share/constants/index'

export const isAdmin = (win: BaseWindow) => win.id === WIND_ID.ADMIN
