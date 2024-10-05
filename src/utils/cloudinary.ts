import { HttpStatusCode } from '@/constants/http-status-code'
import fs from 'fs'
import { UploadApiErrorResponse, v2 as cloudinary } from 'cloudinary'

import { ErrorWithStatus } from '@/models/errors'
import envVariables from '@/schemas/env-variables.schema'

cloudinary.config({
  cloud_name: envVariables.CLOUDINARY_CLOUD_NAME,
  api_key: envVariables.CLOUDINARY_API_KEY,
  api_secret: envVariables.CLOUDINARY_SECRET_KEY,
})

export async function uploadToCloudinary(file: Express.Multer.File) {
  try {
    const result = await cloudinary.uploader.upload(file.path, { folder: envVariables.CLOUDINARY_FOLDER })

    fs.unlink(file.path, (err) => {
      if (err) {
        throw new ErrorWithStatus({ message: 'Delete file failed', statusCode: HttpStatusCode.InternalServerError })
      }
    })

    return result
  } catch (error) {
    throw new ErrorWithStatus({
      message: (error as UploadApiErrorResponse).message,
      statusCode: HttpStatusCode.InternalServerError,
    })
  }
}
