import { Router } from 'express'

import { uploadAvatar } from '@/utils/multer'
import { wrapRequestHandler } from '@/utils/handlers'
import authService from '@/services/auth.services'
import profileService from '@/services/profile.services'
import { avatarSchema, verifyPasswordBodySchema, updateProfileBodySchema } from '@/schemas/profile.schema'
import { authorizationValidator, fileValidator, zodValidator } from '@/middlewares/validators.middleware'
import {
  deleteMyAccountController,
  getProfileController,
  updateProfileController,
  uploadAvatarController,
  verifyPasswordController,
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

/**
 * @swagger
 * /profile:
 *  patch:
 *   tags:
 *   - profile
 *   summary: Update profile
 *   description: Update user profile by token and body
 *   operationId: updateProfile
 *   security:
 *    - bearerAuth: []
 *   requestBody:
 *    description: Profile information (avatar or name, at least one field is required)
 *    required: true
 *    content:
 *     application/json:
 *      schema:
 *       $ref: '#/components/schemas/updateProfileBodySchema'
 *   responses:
 *    '200':
 *     description: Update profile successful
 *     content:
 *      application/json:
 *       schema:
 *        type: object
 *        properties:
 *         message:
 *          type: string
 *          example: Update profile successful
 *         data:
 *          $ref: '#/components/schemas/dataGetProfileResponseSchema'
 *    '400':
 *     description: At least one field is required to update
 *    '401':
 *     description: Unauthorized
 *    '403':
 *     description: Email has not been verified
 *    '404':
 *     description: User not found
 *    '422':
 *     description: Invalid value or missing field
 */
profileRouter.patch(
  '/',
  authorizationValidator({ isLoginRequired: true, customHandler: authService.ensureUserExistsAndVerify }),
  zodValidator(updateProfileBodySchema, { location: 'body', customHandler: profileService.hasFieldToUpdate }),
  wrapRequestHandler(updateProfileController)
)

/**
 * @swagger
 * /profile/verify-password:
 *  post:
 *   tags:
 *   - profile
 *   summary: Verify password
 *   description: Verify user password
 *   operationId: verifyPassword
 *   security:
 *    - bearerAuth: []
 *   requestBody:
 *    description: Password information
 *    required: true
 *    content:
 *     application/json:
 *      schema:
 *       type: object
 *       required:
 *       - password
 *       properties:
 *        password:
 *         type: string
 *         example: 123456
 *   responses:
 *    '200':
 *     description: Verify password successful
 *     content:
 *      application/json:
 *       schema:
 *        type: object
 *        properties:
 *         message:
 *          type: string
 *          example: Verify password successful
 *    '401':
 *     description: Unauthorized
 *    '404':
 *     description: User not found
 *    '422':
 *     description: Password is incorrect
 */
profileRouter.post(
  '/verify-password',
  authorizationValidator({ isLoginRequired: true, customHandler: authService.ensureUserExists }),
  zodValidator(verifyPasswordBodySchema, { location: 'body', customHandler: profileService.validateUserPassword }),
  wrapRequestHandler(verifyPasswordController)
)

/**
 * @swagger
 * /profile:
 *  delete:
 *   tags:
 *   - profile
 *   summary: Delete my account (must using profile/verify-password route first)
 *   description: Delete user account by token
 *   operationId: deleteMyAccount
 *   security:
 *    - bearerAuth: []
 *   responses:
 *    '200':
 *     description: Delete account successful
 *     content:
 *      application/json:
 *       schema:
 *        type: object
 *        properties:
 *         message:
 *          type: string
 *          example: Delete account successful
 *    '401':
 *     description: Unauthorized
 *    '404':
 *     description: User not found
 */
profileRouter.delete(
  '/',
  authorizationValidator({ isLoginRequired: true }),
  wrapRequestHandler(deleteMyAccountController)
)

export default profileRouter
