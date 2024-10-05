/**
 * @swagger
 * components:
 *  schemas:
 *   registerBodySchema:
 *    required:
 *    - name
 *    - email
 *    - password
 *    - confirmPassword
 *    type: object
 *    properties:
 *     name:
 *      type: string
 *      example: Bruce Wayne
 *     email:
 *      type: string
 *      example: brucewayne@wayne-ent.dc
 *     password:
 *      type: string
 *      format: password
 *      example: Abcd12345@#
 *     confirmPassword:
 *      type: string
 *      format: password
 *      example: Abcd12345@#
 *
 *   emailVerifyTokenSchema:
 *    required:
 *    - emailVerifyToken
 *    type: object
 *    properties:
 *     emailVerifyToken:
 *      type: string
 *      example: eyJhbGciOiJIUzI1N...
 *
 *   loginBodySchema:
 *    required:
 *    - email
 *    - password
 *    type: object
 *    properties:
 *     email:
 *      type: string
 *      example: brucewayne@wayne-ent.dc
 *     password:
 *      type: string
 *      format: password
 *      example: Abcd12345@#
 *
 *   refreshTokenSchema:
 *    required:
 *    - refreshToken
 *    type: object
 *    properties:
 *     refreshToken:
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
 *    - confirmPassword
 *    type: object
 *    properties:
 *     forgot_password_token:
 *      type: string
 *      example: eyJhbGciOiJIUzI1N...
 *     password:
 *      type: string
 *      format: password
 *      example: Abcd12345@#
 *     confirmPassword:
 *      type: string
 *      format: password
 *      example: Abcd12345@#
 *
 *   avatarFileSchema:
 *    type: object
 *    properties:
 *     avatar:
 *      type: string
 *      format: binary
 *      example: avatar.jpg
 *
 *   UpdateMeReqBody:
 *    type: object
 *    properties:
 *     name:
 *      type: string
 *      example: Bruce Wayne
 *     avatar:
 *      type: string
 *      example: https://www.wayne-ent.dc/brucewayne.jpg
 *
 *   dataAuthResponseSchema:
 *    type: object
 *    properties:
 *     access_token:
 *      type: string
 *      example: eyJhbGciOiJIUzI1N...
 *     refresh_token:
 *      type: string
 *      example: eyJhbGciOiJIUzI1N...
 *
 *   userSchema:
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
 *      example: brucewayne@wayne-ent.dc
 *     avatar:
 *      type: string
 *      nullable: true
 *      example: https://www.wayne-ent.dc/brucewayne.jpg
 *     isVerified:
 *      type: boolean
 *      example: true
 *     created_at:
 *      type: string
 *      format: ISO 8601
 *      example: 2025-02-19T08:46:24.000Z
 *     updated_at:
 *      type: string
 *      format: ISO 8601
 *      example: 2025-02-19T08:46:24.000Z
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
