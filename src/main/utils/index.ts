import { app } from 'electron'

export const isBuild = (): boolean => app.isPackaged
