import path from 'path'
import multer from 'multer'
import { v4 as uuidv4 } from 'uuid'
import envVariables from '@/schemas/env-variables.schema'

export const uploadAvatar = multer({
  limits: { fileSize: envVariables.CLOUDINARY_AVATAR_SIZE_LIMIT },
  fileFilter(_req, file, cb) {
    const filetypes = /jpeg|jpg|png/
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase())
    const mimetype = filetypes.test(file.mimetype)

    if (mimetype && extname) {
      return cb(null, true)
    } else {
      return cb(null, false)
    }
  },
  preservePath: true,
  storage: multer.diskStorage({
    filename: async (_req, file, cb) => {
      const extension = path.extname(file.originalname)
      const originalName = path.basename(file.originalname, extension)
      const uniqueID = uuidv4()

      cb(null, `${uniqueID}-${originalName}${extension}`)
    },
    destination: (_req, _file, cb) => {
      cb(null, 'uploads/')
    },
  }),
}).single('avatar')
