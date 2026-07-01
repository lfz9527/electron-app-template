export const IPC = {
  DIALOG_OPEN_FILE: 'dialog:openFile',
  DIALOG_SAVE_FILE: 'dialog:saveFile',
  FILE_READ: 'file:read',
  FILE_WRITE: 'file:write',
  STORE_GET: 'store:get',
  STORE_SET: 'store:set',
  STORE_CHANGED: 'store:changed',
  WINDOW_GET_INFO: 'window:getInfo',
  WINDOW_OPEN: 'window:open',
  WINDOW_BEFORE_CLOSE: 'window:beforeClose',
  WINDOW_CLOSE: 'window:close',
  WINDOW_DESTROY: 'window:destroy',
  WINDOW_CLOSE_CANCEL: 'window:closeCancel',
  WINDOW_OPEN_EXCLUSIVE: 'window:openExclusive',
  WINDOW_GET_ALL_IDS: 'window:getAllIds'
} as const
