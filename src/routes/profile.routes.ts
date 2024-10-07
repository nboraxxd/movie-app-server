import { Router } from 'express'

import { uploadAvatar } from '@/utils/multer'
import { wrapRequestHandler } from '@/utils/handlers'
import { avatarSchema } from '@/schemas/files.schema'
import { authorizationValidator, fileValidator, zodValidator } from '@/middlewares/validators.middleware'
import { getProfileController, uploadAvatarController } from '@/controllers/profile.controllers'
import authService from '@/services/auth.services'

const profileRouter = Router()

/**
 * @swagger
 * /profile:
 *  get:
 *   tags:
 *   - profile
 *   summary: Get profile
 *   description: Get user profile by token
 *   operationId: get-profile
 *   security:
 *    - bearerAuth: []
 *   responses:
 *    '200':
 *     description: Get profile successful
 *     content:
 *      application/json:
 *       schema:
 *        type: object
 *        properties:
 *         message:
 *          type: string
 *          example: Get profile successful
 *         data:
 *          $ref: '#/components/schemas/userSchema'
 *    '401':
 *     description: Unauthorized
 *    '404':
 *     description: User not found
 */
profileRouter.get('/', authorizationValidator({ isLoginRequired: true }), wrapRequestHandler(getProfileController))

/**
 * @swagger
 * /profile/upload-avatar:
 *  post:
 *   tags:
 *   - profile
 *   summary: Upload avatar
 *   description: Upload user avatar
 *   operationId: upload-avatar
 *   security:
 *    - bearerAuth: []
 *   requestBody:
 *    description: Avatar file
 *    required: true
 *    content:
 *     multipart/form-data:
 *      schema:
 *       $ref: '#/components/schemas/avatarFileSchema'
 *   responses:
 *    '200':
 *     description: Upload avatar successful
 *     content:
 *      application/json:
 *       schema:
 *        type: object
 *        properties:
 *         message:
 *          type: string
 *          example: Upload avatar successful
 *         data:
 *          type: string
 *          example: https://www.wayne-ent.dc/brucewayne.jpg
 *    '401':
 *     description: Unauthorized
 *    '422':
 *     description: Invalid value or missing field
 */
profileRouter.post(
  '/upload-avatar',
  authorizationValidator({ isLoginRequired: true, customHandler: authService.checkUserVerification }),
  fileValidator(uploadAvatar),
  zodValidator({ schema: avatarSchema, customPath: 'avatar', location: 'file' }),
  wrapRequestHandler(uploadAvatarController)
)

export default profileRouter