import { execSync } from 'node:child_process'
import { readFileSync, writeFileSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..')
const PKG_PATH = join(ROOT, 'package.json')

interface PackageJson {
  version: string
}

/**
 * 生成时间戳版本：<major>.<minor>.<patch>-<yyyyMMddHHmmss>
 * @param base 基础版本（如 1.0.0）
 * @returns 时间戳版本号
 */
function getTimestampVersion(base: string): string {
  const now = new Date()
  const pad = (num: number): string => String(num).padStart(2, '0')
  const ts = [
    now.getFullYear(),
    pad(now.getMonth() + 1),
    pad(now.getDate()),
    pad(now.getHours()),
    pad(now.getMinutes()),
    pad(now.getSeconds())
  ].join('')
  return `${base}-${ts}`
}

/**
 * 基于 git 派生版本号：<major>.<minor>.<patch>-<commitCount>.<shortHash>
 * 使用 prerelease 段保证合法 semver（electron-updater 严格校验，4 段格式会报错）；
 * git 信息不可用（commit hash 为空，如非 git 仓库或无提交）时回退为时间戳版本
 * @param version 当前 package.json 的 version
 * @returns 派生后的版本号
 */
function getGitVersion(version: string): string {
  const base = version.split('-')[0]
  let commitCount = ''
  let shortHash = ''
  try {
    commitCount = execSync('git rev-list --count HEAD', { cwd: ROOT, encoding: 'utf8' }).trim()
    shortHash = execSync('git rev-parse --short HEAD', { cwd: ROOT, encoding: 'utf8' }).trim()
  } catch {
    commitCount = ''
    shortHash = ''
  }
  if (!shortHash) {
    console.warn('[bump-version] 无法获取 git commit hash，回退使用时间戳版本')
    return getTimestampVersion(base)
  }
  return `${base}-${commitCount}.${shortHash}`
}

const pkg = JSON.parse(readFileSync(PKG_PATH, 'utf8')) as PackageJson
const nextVersion = getGitVersion(pkg.version)
pkg.version = nextVersion
writeFileSync(PKG_PATH, `${JSON.stringify(pkg, null, 2)}\n`)
console.log(`[bump-version] package.json version -> ${nextVersion}`)
