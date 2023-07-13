
import createError from 'http-errors'
import { ArticlesService } from '../services/ArticlesService.js'
import { WebhooksService } from '../services/WebhooksService.js'

/**
 * Encapsulates a controller.
 */
export class ArticlesController {
  /**
   * The service.
   *
   * @type {ArticlesService}
   */
  #service

  #webhooksService
  /**
   * Initializes a new instance.
   *
   * @param {service} service - A service instantiated from a class with the same capabilities as ArticlesService.
   * @param {WebhooksService} service - A service instantiated from a class with the same capabilities as WebhooksService.
   */
  constructor (service, webhooksService) {
    this.#service = service
    this.#webhooksService = webhooksService
  }

  /**
   * Provide req.article to the route if :id is present.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   * @param {string} id - The value of the id for the article to load.
   */
  async loadArticle (req, res, next, id) {
    try {
      // Get the article.
      const article = await this.#service.getById(id)

      // If no article found send a 404 (Not Found).
      if (!article) {
        next(createError(404, 'The requested  was not found.'))
        return
      }

      // Provide the article to req.
      req.article = article

      // Next middleware.
      next()
    } catch (error) {
      next(error)
    }
  }

  /**
   * Sends a JSON response containing a article.
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
      .location(` ${location.href}/${req.article._id}`)
      .status(200).json({
        article: req.article,
        message: ' get one article',
        _links: {
          self: { href: ` ${location.href}/${req.article._id}` },
          delete: { href: `${location.href}/${req.article._id}`, method: 'DELETE' },
          update: { href: `${location.href}/${req.article._id}`, method: 'PUT', type: 'application/json' },
          modify: { href: `${location.href}/${req.article._id}`, method: 'PATCH', type: 'application/json' }

        }
      })
  }

  /**
   * Sends a JSON response containing all articles.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
  async findAll (req, res, next) {
    try {
      let { page, ...query } = req.query

      page = parseInt(page) || 1 // Default to first page if page query parameter not provided
      const startIndex = (page - 1) * 10
      const endIndex = page * 10

      const location = new URL(
        `${req.protocol}://${req.get('host')}${req.baseUrl}`)

      const articles = await this.#service.get(query)

      const paginatedArticles = articles.slice(startIndex, endIndex)

      const articleArray = this.modifyArticlesArray(paginatedArticles, location)
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
          message: ' get all  articles',
          _embedded: { articles: articleArray },
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
                properties: { description: { type: 'string' }, title: { type: 'string' }, city: { type: 'string' }, type: 'string', images: { type: ' Array of string' } }
              }
            }
          }
        })
    } catch (error) {
      next(error)
    }
  }

  /**
   * Add links to the articles object.
   *
   * @param {object} articles  - array of articles
   * @param {string} location - URl location
   * @returns articlesArray
   */
  modifyArticlesArray (articles, location) {
    const articlesArray = []

    for (let i = 0; i < articles.length; i++) {
      const newObj = Object.assign({}, articles[i]._doc, {
        links: { self: `${location.href}/${articles[i]._id}` }
      })

      articlesArray.push(newObj)
    }
    return articlesArray
  }

  /**
   * Creates a new article.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
  async create (req, res, next) {
    try {
      const article = await this.#service.insert({
        description: req.body.description,
        title: req.body.title,
        city: req.body.city,
        type: req.body.type,
        ownerId: req.user.userId,
        ownerName: req.user.username,
        images: req.body.images
      })

      const location = new URL(
        `${req.protocol}://${req.get('host')}${req.baseUrl}/`
      )

      this.#webhooksService.fireWebhook(article)
      res
        .location(`${location.href}${article._id}`)
        .status(201)
        .json({
          article,
          _links: {
            self: { href: `${location.href}${article._id}` },
            delete: { href: `${location.href}${article._id}`, method: 'DELETE' },
            update: { href: `${location.href}${article._id}`, method: 'put' },
            articles: { href: location.href }
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
   * Partially updates a specific article.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
  async partiallyUpdate (req, res, next) {
    try {
      const partialArticle = {}
      if ('description' in req.body) partialArticle.description = req.body.description
      if ('city' in req.body) partialArticle.city = req.body.city
      if ('images' in req.body) partialArticle.images = req.body.images

      await this.#service.update(req.params.id, partialArticle)
      const location = new URL(
        `${req.protocol}://${req.get('host')}${req.baseUrl}/`
      )
      res
        .location(`${location.href}${req.article._id}`)
        .status(200)
        .json({
          message: 'the article is updated',
          _links: {
            self: { href: `${location.href}${req.article._id}` },
            delete: { href: `${location.href}${req.article._id}`, method: 'DELETE' },
            update: { href: `${location.href}${req.article._id}`, method: 'put' },
            allArticles: { href: location.href }
          }
        })
        .end()
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
   * Completely updates a specific article.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
  async update (req, res, next) {
    try {
      const { title, description, city, type, images } = req.body
      const ownerId = req.user.userId

      const ownerName = req.user.username
      await this.#service.replace(req.params.id, { title, description, city, type, images, ownerId, ownerName })

      const location = new URL(
        `${req.protocol}://${req.get('host')}${req.baseUrl}/`
      )
      res
        .location(`${location.href}${req.article._id}`)
        .status(200)
        .json({
          message: 'the article is updated',
          _links: {
            self: { href: `${location.href}${req.article._id}` },
            delete: { href: `${location.href}${req.article._id}`, method: 'DELETE' },
            modify: { href: `${location.href}${req.article._id}`, method: 'PATCH' },
            allArticles: { href: location.href }
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
   * Deletes the specified article.
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
