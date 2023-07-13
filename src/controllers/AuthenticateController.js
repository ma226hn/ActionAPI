/**
 * controller class
 */

// import createError from 'http-errors'
import jwt from 'jsonwebtoken'
import createError from 'http-errors'

/**
 * Authenticates requests.
 *
 * If authentication is successful, `req.user`is populated and the
 * request is authorized to continue.
 * If authentication fails, an unauthorized response will be sent.
 *
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 * @param {Function} next - Express next middleware function.
 */
export class AuthenticateController {
  /**
   * Authenticate function.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
  async authenticateJWT (req, res, next) {
    try {
      const PUBLIC_KEY = await req.app.get('container').resolve('PUBLIC_KEY')
      const accessTokenBuffer = Buffer.from(PUBLIC_KEY, 'base64')
      const [authenticationScheme, token] = req.headers.authorization?.split(' ')

      if (authenticationScheme !== 'Bearer') {
        throw new Error('Invalid authentication scheme.')
      }

      const payload = jwt.verify(token, accessTokenBuffer)
      req.user = {
        username: payload.username,
        firstName: payload.given_name,
        lastName: payload.family_name,
        email: payload.email,
        userId: payload.sub

      }

      next()
    } catch (err) {
      const error = createError(401, 'Access token invalid or not provided.')
      error.cause = err
      next(error)
    }
  }

  /**
   * Check if the user has the permission to delete article..
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
  hasPermission (req, res, next) {
    req.user?.userId === req.article.ownerId
      ? next()
      : next(createError(403, 'The request contained valid data and was understood by the server, but the server is refusing action due to the authenticated user not having the necessary permissions for the article.'))
  }

  /**
   * Check if the user has the permission to delete webhook.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
  hasPermissionOwnerWebhook (req, res, next) {
    req.user?.userId === req.webhook.userId
      ? next()
      : next(createError(403, 'The request contained valid data and was understood by the server, but  the server is refusing action due to the authenticated user not having the necessary permissions for the webhook.'))
  }
}
