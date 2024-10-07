import path from 'path'
import multer from 'multer'
import envVariables from '@/schemas/env-variables.schema'

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, 'uploads/')
  },
  filename: async (_req, file, cb) => {
    const { nanoid } = await import('nanoid')

    const uniqueID = nanoid()
    const extension = path.extname(file.originalname)
    const originalName = path.basename(file.originalname, extension)

    cb(null, `${uniqueID}-${originalName}${extension}`)
  },
})

export const uploadAvatar = multer({
  storage,
  limits: { fileSize: envVariables.CLOUDINARY_AVATAR_SIZE_LIMIT, files: 1 },
  fileFilter(req, file, cb) {
    const filetypes = /jpeg|jpg|png/
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase())
    const mimetype = filetypes.test(file.mimetype)

    if (mimetype && extname) {
      return cb(null, true)
    } else {
      cb(null, false)
    }
  },
}).single('avatar')
