/**
 * User controller class
 */

// import createError from 'http-errors'
import jwt from 'jsonwebtoken'
import createError from 'http-errors'
import { UsersService } from '../services/UsersService.js'

/**
 * Encapsulates a controller.
 */
export class UsersController {
  /**
   * The service.
   *
   * @type {UsersService}
   */
  #service

  /**
   * Initializes a new instance.
   *
   * @param {UsersService} service - A service instantiated from a class with the same capabilities as UsersService.
   */
  constructor (service) {
    this.#service = service
  }

  /**
   * Load user information.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   * @param  {string} id  - Id for the user.
   */

  /**
   * Login method.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
  async login (req, res, next) {
    try {
      const userCredential = {
        username: req.body.username,
        password: req.body.password
      }
      // const user = await User.authenticate(req.body.username, req.body.password)
      const user = await this.#service.authenticate(userCredential)

      const payload = {
        sub: user.id,
        username: user.username,
        given_name: user.firstName,
        family_name: user.lastName,
        email: user.email

      }

      console.log(user)

      const PRIVATE_KEY = await req.app.get('container').resolve('PRIVATE_KEY')
      const ACCESS_TOKEN_LIFE = await req.app.get('container').resolve('ACCESS_TOKEN_LIFE')

      const accessTokenBuffer = Buffer.from(PRIVATE_KEY, 'base64')
      // Create the access token with the shorter lifespan.
      const accessToken = jwt.sign(payload, accessTokenBuffer, {
        algorithm: 'RS256',
        expiresIn: ACCESS_TOKEN_LIFE
      })
      const location = new URL(
        `${req.protocol}://${req.get('host')}`
      )

      res
        .status(201)
        .json({
          access_token: accessToken,
          user,
          links_: {
            self: `${location.href}${req.baseUrl}/login`,
            articles: `${location.href}/articles`,
            webhook: `${location.href}/webhooks`,
            bidding: `${location.href}/biddings`
          }

        })
    } catch (error) {
      // Authentication failed.

      const err = createError(401)
      err.cause = error

      next(err)
    }
  }

  /**
   * Registers a user.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
  async register (req, res, next) {
    try {
      const location = new URL(
        `${req.protocol}://${req.get('host')}`
      )

      const user = {
        username: req.body.username,
        password: req.body.password,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email

      }
      // await user.save()
      await this.#service.save(user)

      res
        .status(201)
        .json({
          userId: user.id,
          message: 'the user have been added',
          links: {
            self: `${location.href}${req.baseUrl}/register`,
            login: `${location.href}${req.baseUrl}/login`,
            articles: `${location.href}/articles`

          }
        })
    } catch (error) {
      let err = error

      if (err.code === 11000) {
        // Duplicated keys.
        err = createError(409)
        err.cause = error
      } else if (error.name === 'ValidationError') {
        // Validation error(s).
        err = createError(400)
        err.cause = error
      }

      next(err)
    }
  }
}
