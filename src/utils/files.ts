import fs from 'fs'

const UPLOAD_DIR = 'uploads/'

export function initFolder() {
  if (!fs.existsSync(UPLOAD_DIR)) {
    fs.mkdirSync(UPLOAD_DIR, { recursive: true })
  }
}
