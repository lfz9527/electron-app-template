import { useEffect, useState } from 'react'
import Versions from './components/Versions'
import electronLogo from './assets/electron.svg'

const winIds = await window.api.getWindowIds()

function App(): React.JSX.Element {
  const [showCloseConfirm, setShowCloseConfirm] = useState(false)

  useEffect(() => {
    window.api.getWindowInfo().then(({ id }) => {
      if (id === winIds.SETTING) {
        window.api.onBeforeClose(() => setShowCloseConfirm(true))
      }
    })
  }, [])

  const ipcHandle = async () => {
    const windowInfo = await window.api.getWindowInfo()

    console.log(222, windowInfo)
  }

  return (
    <>
      <img alt="logo" className="logo" src={electronLogo} />
      <div className="creator">Powered by electron-vite</div>
      <div className="text">
        Build an Electron app with <span className="react">React</span>
        &nbsp;and <span className="ts">TypeScript</span>
      </div>
      <p className="tip">
        Please try pressing <code>F12</code> to open the devTool
      </p>
      <div className="actions">
        <div className="action">
          <a href="https://electron-vite.org/" target="_blank" rel="noreferrer">
            Documentation
          </a>
        </div>
        <div className="action">
          <a target="_blank" rel="noreferrer" onClick={ipcHandle}>
            Send IPC
          </a>
        </div>
        <div className="action">
          <a onClick={() => window.api.openWindow(winIds.LOGIN)}>Open Login</a>
        </div>
        <div className="action">
          <a onClick={() => window.api.openWindow(winIds.SETTING)}>Open Setting</a>
        </div>
        <div className="action">
          <a onClick={() => window.api.openWindowExclusive(winIds.AUTHOR, [winIds.SETTING])}>Open Author</a>
        </div>
      </div>
      <Versions></Versions>

      {showCloseConfirm && (
        <div className="close-confirm-overlay">
          <div className="close-confirm-dialog">
            <p className="close-confirm-message">是否确认关闭设置窗口？</p>
            <div className="close-confirm-actions">
              <button
                onClick={() => {
                  setShowCloseConfirm(false)
                  window.api.closeCancel()
                }}
              >
                取消
              </button>
              <button onClick={() => window.api.winDestroy()}>确认关闭</button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default App
