
import createError from 'http-errors'
import { WebhooksService } from '../services/WebhooksService.js'

/**
 * Encapsulates a controller.
 */
export class WebhooksController {
  /**
   * The service.
   *
   * @type {WebhooksService}
   */
  #service

  /**
   * Initializes a new instance.
   *
   * @param {WebhooksService} service - A service instantiated from a class with the same capabilities as TasksService.
   */
  constructor (service) {
    this.#service = service
  }

  /**
   * Load webhook.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   * @param {string} id  -Id the webhook.
   */
  async loadWebhook (req, res, next, id) {
    try {
      const webhook = await this.#service.getById(id)

      // If no webhook found send a 404 (Not Found).
      if (!webhook) {
        next(createError(404, 'The requested  was not found.'))
        return
      }

      // Provide the webhook to req.
      req.webhook = webhook

      // Next middleware.
      next()
    } catch (error) {
      next(error)
    }
  }

  /**
   * Get all the webhooks.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
  async findAll (req, res, next) {
    try {
      const location = new URL(
        `${req.protocol}://${req.get('host')}${req.baseUrl}`)

      const webhooks = await this.#service.get()

      const webhooksArray = this.modifyWebhooksArray(webhooks, location)

      res
        .location(location.href)
        .status(200).json({
          message: ' get all  webhooks',
          _embedded: { webhooks: webhooksArray },
          _links: {
            self: { href: location.href },
            create: {
              href: location.href,
              method: 'POST',
              type: 'application/json',
              schema: {
                type: 'object',
                properties: { description: { type: 'string' }, title: { type: 'string' }, city: { type: 'string' }, type: 'should be artwork,antique or vehicle', images: { type: ' Array of string' } }
              }
            }

          }
        })
    } catch (error) {
      next(error)
    }
  }

  /**
   * Modify webhooks array and add links.
   *
   * @param {Array} webhooks -Array of webhooks
   * @param {string} location -Url string.
   * @returns  {Array} webhooksArray
   */
  modifyWebhooksArray (webhooks, location) {
    const webhooksArray = []

    for (let i = 0; i < webhooks.length; i++) {
      const newObj = Object.assign({}, webhooks[i]._doc, {
        links: { self: `${location.href}/${webhooks[i]._id}` }
      })

      webhooksArray.push(newObj)
    }
    return webhooksArray
  }

  /**
   * Creates a new webhook.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
  async create (req, res, next) {
    try {
      const webhook = await this.#service.insert({
        userId: req.user.userId,
        url: req.body.url
      })

      const location = new URL(
        `${req.protocol}://${req.get('host')}${req.baseUrl}/${webhook._id}`
      )

      res
        .location(location.href)
        .status(201)
        .json({
          webhook,
          _links: {
            self: { href: location.href },
            delete: { href: location.href, method: 'DELETE' },
            update: { href: location.href, method: 'PUT' },
            modify: { href: location.href, method: 'PATCH' }

          }
        })
    } catch (error) {
      const err = createError(error.name === 'ValidationError'
        ? 400 // bad format
        : 500 // something went really wrong
      )
      err.cause = error

      next(err)
    }
  }

  /**
   * Delete webhooks.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
  async delete (req, res, next) {
    try {
      await this.#service.delete(req.params.id)

      res
        .status(204)
        .end()
    } catch (error) {
      next(error)
    }
  }
}
