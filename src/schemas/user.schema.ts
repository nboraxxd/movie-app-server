import z from 'zod'

import { emailSchema, passwordSchema } from '@/schemas/common.schema'

/**
 * @swagger
 * components:
 *  schemas:
 *   registerBodySchema:
 *    required:
 *    - name
 *    - email
 *    - password
 *    - confirm_password
 *    type: object
 *    properties:
 *     name:
 *      type: string
 *      example: Bruce Wayne
 *     email:
 *      type: string
 *      example: bruce@wayne.dc
 *     password:
 *      type: string
 *      format: password
 *      example: Abcd12345@#
 *     confirm_password:
 *      type: string
 *      format: password
 *      example: Abcd12345@#
 *
 *   VerifyEmailReqBody:
 *    required:
 *    - email_verify_token
 *    type: object
 *    properties:
 *     email_verify_token:
 *      type: string
 *      example: eyJhbGciOiJIUzI1N...
 *
 *   LoginReqBody:
 *    required:
 *    - email
 *    - password
 *    type: object
 *    properties:
 *     email:
 *      type: string
 *      example: bruce@wayne.dc
 *     password:
 *      type: string
 *      format: password
 *      example: Abcd12345@#
 *
 *   LogoutReqBody:
 *    required:
 *    - refresh_token
 *    type: object
 *    properties:
 *     refresh_token:
 *      type: string
 *      example: eyJhbGciOiJIUzI1N...
 *
 *   ForgotPasswordReqBody:
 *    required:
 *    - email
 *    type: object
 *    properties:
 *     email:
 *      type: string
 *      example: bruce@wayne.dc
 *
 *   VerifyForgotPasswordReqBody:
 *    required:
 *    - forgot_password_token
 *    type: object
 *    properties:
 *     forgot_password_token:
 *      type: string
 *      example: eyJhbGciOiJIUzI1N...
 *
 *   ResetPasswordReqBody:
 *    required:
 *    - forgot_password_token
 *    - password
 *    - confirm_password
 *    type: object
 *    properties:
 *     forgot_password_token:
 *      type: string
 *      example: eyJhbGciOiJIUzI1N...
 *     password:
 *      type: string
 *      format: password
 *      example: Abcd12345@#
 *     confirm_password:
 *      type: string
 *      format: password
 *      example: Abcd12345@#
 *
 *   UpdateMeReqBody:
 *    type: object
 *    properties:
 *     name:
 *      type: string
 *      example: Bruce Wayne
 *     avatar:
 *      type: string
 *      example: https://brucewayne.dc/avatar.jpg
 *
 *   authResponseSchema:
 *    type: object
 *    properties:
 *     access_token:
 *      type: string
 *      example: eyJhbGciOiJIUzI1N...
 *     refresh_token:
 *      type: string
 *      example: eyJhbGciOiJIUzI1N...
 *
 *   SuccessGetMe:
 *    type: object
 *    properties:
 *     _id:
 *      type: string
 *      example: 123abc...
 *     name:
 *      type: string
 *      example: Bruce Wayne
 *     email:
 *      type: string
 *      example: bruce@wayne.dc
 *     date_of_birth:
 *      type: string
 *      format: ISO 8601
 *      example: 1970-02-19T08:46:24.000Z
 *     verify:
 *      type: number
 *      enum: [0, 1, 2]
 *      example: 1
 *     tweeter_circle:
 *      type: array
 *      items:
 *       type: string
 *      example: [123abc..., 456def...]
 *     bio:
 *      type: string
 *      example: I'm rich
 *     location:
 *      type: string
 *      example: Gotham City
 *     website:
 *      type: string
 *      example: https://brucewayne.dc
 *     username:
 *      type: string
 *      example: bruce_wayne
 *     avatar:
 *      type: string
 *      example: https://brucewayne.dc/avatar.jpg
 *     cover_photo:
 *      type: string
 *      example: https://brucewayne.dc/cover.jpg
 *     created_at:
 *      type: string
 *      format: ISO 8601
 *      example: 2021-02-19T08:46:24.000Z
 *     updated_at:
 *      type: string
 *      format: ISO 8601
 *      example: 2021-02-19T08:46:24.000Z
 *
 *   SuccessGetUserProfile:
 *    type: object
 *    properties:
 *     _id:
 *      type: string
 *      example: 123abc...
 *     name:
 *      type: string
 *      example: Bruce Wayne
 *     email:
 *      type: string
 *      example: bruce@wayne.dc
 *     date_of_birth:
 *      type: string
 *      format: ISO 8601
 *      example: 1970-02-19T08:46:24.000Z
 *     tweeter_circle:
 *      type: array
 *      items:
 *       type: string
 *      example: [123abc..., 456def...]
 *     bio:
 *      type: string
 *      example: I'm rich
 *     location:
 *      type: string
 *      example: Gotham City
 *     website:
 *      type: string
 *      example: https://brucewayne.dc
 *     username:
 *      type: string
 *      example: bruce_wayne
 *     avatar:
 *      type: string
 *      example: https://brucewayne.dc/avatar.jpg
 *     cover_photo:
 *      type: string
 *      example: https://brucewayne.dc/cover.jpg
 */

export const registerBodySchema = z
  .object({
    name: z.string({ required_error: 'Name is required' }).trim(),
    email: emailSchema,
    password: passwordSchema,
    confirmPassword: z
      .string({ required_error: 'confirmPassword is required' })
      .min(6, { message: 'confirmPassword must be at least 6 characters' }),
  })
  .strict({ message: 'Additional properties not allowed' })
  .superRefine(({ confirmPassword, password }, ctx) => {
    if (password !== confirmPassword) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Passwords do not match',
        path: ['confirmPassword'],
      })
    }
  })

export type RegisterBodyType = z.TypeOf<typeof registerBodySchema>
