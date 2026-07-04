import { randomBytes, createCipheriv, createDecipheriv } from 'crypto'
import { safeStorage } from 'electron'
import { join } from 'path'
import { getUserDataPath } from './index'
import { readFileSync, writeFileSync, existsSync } from 'fs'

const ALGORITHM = 'aes-256-gcm'
const KEY_LENGTH = 32 // 256 bits
const IV_LENGTH = 12 // 96 bits for GCM
const KEY_FILE = 'encrypted-key.bin' // 存在 userData 目录

// --- 密钥管理（safeStorage 保护） ---

/** 获取或生成 AES 密钥，密钥本身用 safeStorage 加密存储 */
function getOrCreateKey(): Buffer {
  const keyPath = join(getUserDataPath(), KEY_FILE)

  if (existsSync(keyPath)) {
    const encryptedKey = readFileSync(keyPath)
    const base64Key = safeStorage.decryptString(encryptedKey)
    return Buffer.from(base64Key, 'base64')
  }

  // 首次使用，生成新密钥并用 safeStorage 加密持久化
  const key = randomBytes(KEY_LENGTH)
  const encrypted = safeStorage.encryptString(key.toString('base64'))
  writeFileSync(keyPath, encrypted)
  return key
}

// --- 数据加解密（crypto 保护） ---

export function encryptData(plaintext: string): {
  iv: string
  authTag: string
  ciphertext: string
} {
  const key = getOrCreateKey()
  const iv = randomBytes(IV_LENGTH)

  const cipher = createCipheriv(ALGORITHM, key, iv)
  const encrypted = Buffer.concat([cipher.update(plaintext, 'utf8'), cipher.final()])
  const authTag = cipher.getAuthTag()

  return {
    iv: iv.toString('hex'),
    authTag: authTag.toString('hex'),
    ciphertext: encrypted.toString('hex')
  }
}

export function decryptData(encrypted: {
  iv: string
  authTag: string
  ciphertext: string
}): string {
  const key = getOrCreateKey()
  const decipher = createDecipheriv(ALGORITHM, key, Buffer.from(encrypted.iv, 'hex'))
  decipher.setAuthTag(Buffer.from(encrypted.authTag, 'hex'))

  const decrypted = Buffer.concat([
    decipher.update(Buffer.from(encrypted.ciphertext, 'hex')),
    decipher.final()
  ])

  return decrypted.toString('utf8')
}
