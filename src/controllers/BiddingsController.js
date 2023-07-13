
import createError from 'http-errors'
import { BiddingsService } from '../services/BiddingsService.js'

/**
 * Encapsulates a controller.
 */
export class BiddingsController {
  /**
   * The service.
   *
   * @type {BiddingsService}
   */
  #service

  /**
   * Initializes a new instance.
   *
   * @param {BiddingsService} service - A service instantiated from a class with the same capabilities as BiddingsService.
   */
  constructor (service) {
    this.#service = service
  }

  /**
   * Load bidding.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   * @param {string} id  - Id the bidding.
   */
  async loadBidding (req, res, next, id) {
    try {
      // Get the Bidding.
      const bidding = await this.#service.getById(id)

      // If no Bidding found send a 404 (Not Found).
      if (!bidding) {
        next(createError(404, 'The requested  was not found.'))
        return
      }

      // Provide the bidding to req.
      req.bidding = bidding

      // Next middleware.
      next()
    } catch (error) {
      next(error)
    }
  }

  /**
   * Sends a JSON response containing a task.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
  async find (req, res, next) {
    const location = new URL(
      `${req.protocol}://${req.get('host')}${req.baseUrl}`
    )

    res
      .location(` ${location.href}/${req.bidding._id}`)
      .status(200).json({
        bidding: req.bidding,
        message: ' get one bidding',
        _links: {
          self: { href: ` ${location.href}/${req.bidding._id}` },
          delete: { href: `${location.href}/${req.bidding._id}`, method: 'DELETE' },
          update: { href: `${location.href}/${req.bidding._id}`, method: 'PUT' },
          modify: { href: `${location.href}/${req.bidding._id}`, method: 'PATCH' }

        }
      })
  }

  /**
   * Sends a JSON response containing all tasks.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
  async findAllBiddings (req, res, next) {
    try {
      let { page, ...query } = req.query
      page = parseInt(page) || 1 // Default to first page if page query parameter not provided
      const startIndex = (page - 1) * 30
      const endIndex = page * 30

      const biddings = await this.#service.get(query)

      const paginatedBiddings = biddings.slice(startIndex, endIndex)
      const location = new URL(
        `${req.protocol}://${req.get('host')}${req.baseUrl}`
      )
      const biddingsArray = this.modifyBiddingsArray(paginatedBiddings, location)

      let queryString = Object.entries(query)
        .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
        .join('&')
      if (Object.keys(query).length > 0) {
        queryString = '?' + queryString
      }
      let previous = 1
      if ((page - 1) > 0) {
        previous = page - 1
      }

      res
        .location(`${location.href}${queryString}`)
        .status(200).json({
          message: ' get all  biddings',
          _embedded: { biddings: biddingsArray },
          _links: {
            self: { href: `${location.href}${queryString}&page=${page}` },
            next: { href: `${location.href}${queryString}&page=${page + 1}` },
            previous: { href: `${location.href}${queryString}&page=${previous}` },
            create: {
              href: location.href,
              method: 'POST',
              type: 'application/json',
              schema: {
                type: 'object',
                properties: {
                  price: { type: 'number' },
                  articleId: { type: 'string' }
                }
              }
            }
          }
        })
    } catch (error) {
      next(error)
    }
  }

  /**
   * Modify biddings array and add links.
   *
   * @param {Array} biddings -Biddings array
   * @param  {string} location -Url string
   * @returns biddingsArray
   */
  modifyBiddingsArray (biddings, location) {
    const biddingsArray = []

    for (let i = 0; i < biddings.length; i++) {
      const newObj = Object.assign({}, biddings[i]._doc, {
        links: { self: `${location.href}/${biddings[i]._id}` }
      })

      biddingsArray.push(newObj)
    }
    return biddingsArray
  }

  /**
   * Creates a new bidding.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
  async create (req, res, next) {
    try {
      const bidding = await this.#service.insert({
        price: req.body.price,
        articleId: req.body.articleId,
        bidderId: req.user.userId,
        bidderName: req.user.username

      })

      const location = new URL(
        `${req.protocol}://${req.get('host')}${req.baseUrl}/${bidding._id}`
      )

      res
        .location(location.href)
        .status(201)
        .json({
          bidding,
          message: 'the bidding is added',
          links: {
            self: location.href
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
}
