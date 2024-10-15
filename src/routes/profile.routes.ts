import { Router } from 'express'

import { uploadAvatar } from '@/utils/multer'
import { wrapRequestHandler } from '@/utils/handlers'
import authService from '@/services/auth.services'
import { avatarSchema, updateProfileBodySchema } from '@/schemas/profile.schema'
import { authorizationValidator, fileValidator, zodValidator } from '@/middlewares/validators.middleware'
import {
  deleteMyAccountController,
  getProfileController,
  updateProfileController,
  uploadAvatarController,
} from '@/controllers/profile.controllers'

const profileRouter = Router()

/**
 * @swagger
 * /profile:
 *  get:
 *   tags:
 *   - profile
 *   summary: Get profile
 *   description: Get user profile by token
 *   operationId: getProfile
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
 *          $ref: '#/components/schemas/dataGetProfileResponseSchema'
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
 *   operationId: uploadAvatar
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
  fileValidator(uploadAvatar),
  zodValidator(avatarSchema, { customPath: 'avatar', location: 'file' }),
  authorizationValidator({ isLoginRequired: true, customHandler: authService.ensureUserExistsAndVerify }),
  wrapRequestHandler(uploadAvatarController)
)

profileRouter.patch(
  '/',
  authorizationValidator({ isLoginRequired: true, customHandler: authService.ensureUserExistsAndVerify }),
  zodValidator(updateProfileBodySchema, { location: 'body' }),
  wrapRequestHandler(updateProfileController)
)

profileRouter.delete(
  '/',
  authorizationValidator({ isLoginRequired: true, customHandler: authService.ensureUserExists }),
  wrapRequestHandler(deleteMyAccountController)
)

export default profileRouter
