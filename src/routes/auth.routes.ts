import { Router } from 'express'

import authService from '@/services/auth.services'
import { wrapRequestHandler } from '@/utils/handlers'
import { attachDecodedEmailVerifyTokenToReq, attachDecodedRefreshTokenToReq } from '@/utils/jwt'
import {
  registerBodySchema,
  emailVerifyTokenSchema,
  loginBodySchema,
  refreshTokenSchema,
  changePasswordBodySchema,
  forgotPasswordBodySchema,
  resetPasswordBodySchema,
} from '@/schemas/auth.schema'
import { zodValidator, authorizationValidator, tokenValidator } from '@/middlewares/validators.middleware'
import {
  changePasswordController,
  forgotPasswordController,
  loginController,
  logoutController,
  refreshTokenController,
  registerController,
  resendEmailVerificationController,
  resetPasswordController,
  verifyEmailController,
} from '@/controllers/auth.controllers'

const authRouter = Router()

/**
 * @swagger
 * /auth/register:
 *  post:
 *   tags:
 *   - auth
 *   summary: Register a new user
 *   description: Create a new user having name, email, password and confirm password
 *   operationId: register
 *   requestBody:
 *    description: User information
 *    required: true
 *    content:
 *     application/json:
 *      schema:
 *       $ref: '#/components/schemas/registerBodySchema'
 *   responses:
 *    '201':
 *     description: Register success
 *     content:
 *      application/json:
 *       schema:
 *        type: object
 *        properties:
 *         message:
 *          type: string
 *          example: Please check your email to verify your account.
 *         data:
 *          $ref: '#/components/schemas/dataAuthResponseSchema'
 *    '422':
 *     description: Invalid value or missing field
 */
authRouter.post(
  '/register',
  zodValidator(registerBodySchema, { location: 'body', customHandler: authService.validateUserRegister }),
  wrapRequestHandler(registerController)
)

/**
 * @swagger
 * /auth/resend-email-verification:
 *  post:
 *   tags:
 *   - auth
 *   summary: Resend email verification
 *   description: Resend email verification using authorization token
 *   operationId: resendEmailVerification
 *   security:
 *    - bearerAuth: []
 *   responses:
 *    '200':
 *     description: Resend email verification successful
 *     content:
 *      application/json:
 *       schema:
 *        type: object
 *        properties:
 *         message:
 *          type: string
 *          example: Please check your email to verify your account
 *    '400':
 *     description: Account has been verified
 *    '401':
 *     description: Unauthorized
 *    '404':
 *     description: User not found
 *    '429':
 *     description: Too many requests
 */
authRouter.post(
  '/resend-email-verification',
  authorizationValidator({ isLoginRequired: true, customHandler: authService.validateResendEmailVerificationReq }),
  wrapRequestHandler(resendEmailVerificationController)
)

/**
 * @swagger
 * /auth/verify-email:
 *  post:
 *   tags:
 *   - auth
 *   summary: Verify email
 *   description: Verify email using email verify token
 *   operationId: verifyEmail
 *   requestBody:
 *    description: Email verify token
 *    required: true
 *    content:
 *     application/json:
 *      schema:
 *       $ref: '#/components/schemas/emailVerifyTokenSchema'
 *   responses:
 *    '200':
 *     description: Verify email successful
 *     content:
 *      application/json:
 *       schema:
 *        type: object
 *        properties:
 *         message:
 *          type: string
 *          example: Verify email successful
 *         data:
 *          $ref: '#/components/schemas/dataAuthResponseSchema'
 *    '400':
 *     description: Account has been verified
 *    '401':
 *     description: Unauthorized
 *    '404':
 *     description: User not found
 *    '422':
 *     description: Invalid value or missing field
 */
authRouter.post(
  '/verify-email',
  tokenValidator(emailVerifyTokenSchema, attachDecodedEmailVerifyTokenToReq, authService.validateUserVerifyEmail),
  wrapRequestHandler(verifyEmailController)
)

/**
 * @swagger
 * /auth/login:
 *  post:
 *   tags:
 *   - auth
 *   summary: Login
 *   description: Login using email and password
 *   operationId: login
 *   requestBody:
 *    description: Email and password to login
 *    required: true
 *    content:
 *     application/json:
 *      schema:
 *       $ref: '#/components/schemas/loginBodySchema'
 *   responses:
 *    '200':
 *     description: Login successful
 *     content:
 *      application/json:
 *       schema:
 *        type: object
 *        properties:
 *         message:
 *          type: string
 *          example: Login successful
 *         data:
 *          $ref: '#/components/schemas/dataAuthResponseSchema'
 *    '422':
 *     description: Invalid value or missing field
 */
authRouter.post(
  '/login',
  zodValidator(loginBodySchema, { location: 'body', customHandler: authService.validateUserLogin }),
  wrapRequestHandler(loginController)
)

/**
 * @swagger
 * /auth/refresh-token:
 *  post:
 *   tags:
 *   - auth
 *   summary: Refresh token
 *   description: Refresh token using refresh token
 *   operationId: refreshToken
 *   requestBody:
 *    description: Refresh token
 *    required: true
 *    content:
 *     application/json:
 *      schema:
 *       $ref: '#/components/schemas/refreshTokenSchema'
 *   responses:
 *    '200':
 *     description: Refresh token successful
 *     content:
 *      application/json:
 *       schema:
 *        type: object
 *        properties:
 *         message:
 *          type: string
 *          example: Refresh token successful
 *         data:
 *          $ref: '#/components/schemas/dataAuthResponseSchema'
 *    '401':
 *     description: Unauthorized
 */
authRouter.post(
  '/refresh-token',
  tokenValidator(refreshTokenSchema, authService.validateRefreshTokenRequest),
  wrapRequestHandler(refreshTokenController)
)

/**
 * @swagger
 * /auth/logout:
 *  post:
 *   tags:
 *   - auth
 *   summary: Logout
 *   description: Logout using refresh token
 *   operationId: logout
 *   requestBody:
 *    description: Refresh token
 *    required: true
 *    content:
 *     application/json:
 *      schema:
 *       $ref: '#/components/schemas/refreshTokenSchema'
 *   responses:
 *    '200':
 *     description: Logout successful
 *     content:
 *      application/json:
 *       schema:
 *        type: object
 *        properties:
 *         message:
 *          type: string
 *          example: Logout successful
 *    '401':
 *     description: Unauthorized
 */
authRouter.post(
  '/logout',
  tokenValidator(refreshTokenSchema, attachDecodedRefreshTokenToReq),
  wrapRequestHandler(logoutController)
)

/**
 * @swagger
 * /auth/change-password:
 *  patch:
 *   tags:
 *   - auth
 *   summary: Change password
 *   description: Change password using old password, new password and confirm password
 *   operationId: changePassword
 *   security:
 *    - bearerAuth: []
 *   requestBody:
 *    description: Change password information
 *    required: true
 *    content:
 *     application/json:
 *      schema:
 *       type: object
 *       required:
 *       - currentPassword
 *       - newPassword
 *       - confirmNewPassword
 *       properties:
 *        currentPassword:
 *         type: string
 *         example: 123456
 *        newPassword:
 *         type: string
 *         example: 12345678
 *        confirmNewPassword:
 *         type: string
 *         example: 12345678
 *   responses:
 *    '200':
 *     description: Change password successful
 *     content:
 *      application/json:
 *       schema:
 *        type: object
 *        properties:
 *         message:
 *          type: string
 *          example: Change password successful
 *    '401':
 *     description: Unauthorized
 *    '403':
 *     description: Email has not been verified
 *    '404':
 *     description: User not found
 *    '422':
 *     description: Invalid value or missing field
 */
authRouter.patch(
  '/change-password',
  authorizationValidator({
    isLoginRequired: true,
  }),
  zodValidator(changePasswordBodySchema, {
    location: 'body',
    customHandler: authService.validateChangePasswordRequest,
  }),
  wrapRequestHandler(changePasswordController)
)

/**
 * @swagger
 * /auth/forgot-password:
 *  post:
 *   tags:
 *   - auth
 *   summary: Forgot password
 *   description: Forgot password using email
 *   operationId: forgotPassword
 *   requestBody:
 *    description: Email need to recover password
 *    required: true
 *    content:
 *     application/json:
 *      schema:
 *       type: object
 *       required:
 *       - email
 *       properties:
 *        email:
 *         type: string
 *         example: brucewayne@wayne-ent.dc
 *   responses:
 *    '200':
 *     description: Please check your email to reset your password
 *     content:
 *      application/json:
 *       schema:
 *        type: object
 *        properties:
 *         message:
 *          type: string
 *          example: Please check your email to reset your password
 *    '400':
 *     description: Account has been verified
 *    '401':
 *     description: Unauthorized
 *    '404':
 *     description: User not found
 *    '429':
 *     description: Too many requests
 */
authRouter.post(
  '/forgot-password',
  zodValidator(forgotPasswordBodySchema, {
    location: 'body',
    customHandler: authService.validateForgotPasswordRequest,
  }),
  wrapRequestHandler(forgotPasswordController)
)

/**
 * @swagger
 * /auth/reset-password:
 *  post:
 *   tags:
 *   - auth
 *   summary: Reset password
 *   description: Reset password using reset password token, new password and confirm password
 *   operationId: resetPassword
 *   requestBody:
 *    description: Reset password information
 *    required: true
 *    content:
 *     application/json:
 *      schema:
 *       type: object
 *       required:
 *       - resetPasswordToken
 *       - password
 *       - confirmPassword
 *       properties:
 *        resetPasswordToken:
 *         type: string
 *         example: eyJhbGciOiJIUzI1...
 *        password:
 *         type: string
 *         example: 12345678
 *        confirmPassword:
 *         type: string
 *         example: 12345678
 *   responses:
 *    '200':
 *     description: Reset password successful. Please login again
 *     content:
 *      application/json:
 *       schema:
 *        type: object
 *        properties:
 *         message:
 *          type: string
 *          example: Reset password successful. Please login again
 *    '400':
 *     description: Reset password token is invalid
 *    '404':
 *     description: User not found
 *    '422':
 *     description: Invalid value or missing field
 */
authRouter.post(
  '/reset-password',
  zodValidator(resetPasswordBodySchema, {
    location: 'body',
    customHandler: authService.validateResetPasswordTokenAndAttachUser,
  }),
  wrapRequestHandler(resetPasswordController)
)

export default authRouter
