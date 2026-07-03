import { app } from 'electron'
import { BaseWindow } from '@main/windows/BaseService'
import { WIND_ID } from '@share/constants/index'

export const isAdmin = (win: BaseWindow) => win.id === WIND_ID.ADMIN

// 系统临时文件夹
export const getTempPath = () => app.getPath('temp')
// 程序exe路径
export const getExePath = () => app.getPath('exe')
// 用户数据
export const getUserDataPath = () => app.getPath('userData')
