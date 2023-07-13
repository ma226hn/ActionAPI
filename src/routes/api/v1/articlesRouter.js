/**
 *
 *
 */

import express from 'express'

export const router = express.Router()

/**
 * Resolve articlesController.
 *
 @param {object} req - Express request object.
 *
 */
const resolveArticlesController = (req) => req.app.get('container').resolve('ArticlesController')
/**
 * Resolve AuthenticateController.
 *
 @param {object} req - Express request object.
 */
const resolveAuthenticateController = (req) => req.app.get('container').resolve('AuthenticateController')

router.get('/', (req, res, next) => resolveArticlesController(req).findAll(req, res, next))
router.param('id', (req, res, next, id) => resolveArticlesController(req).loadArticle(req, res, next, id))

router.get('/:id', (req, res, next) => resolveArticlesController(req).find(req, res, next))

router.post('/',
  (req, res, next) => resolveAuthenticateController(req).authenticateJWT(req, res, next),
  (req, res, next) => resolveArticlesController(req).create(req, res, next))

router.patch('/:id', (req, res, next) => resolveAuthenticateController(req).authenticateJWT(req, res, next),
  (req, res, next) => resolveAuthenticateController(req).hasPermission(req, res, next),
  (req, res, next) => resolveArticlesController(req).partiallyUpdate(req, res, next))

router.put('/:id', (req, res, next) => resolveAuthenticateController(req).authenticateJWT(req, res, next),
  (req, res, next) => resolveAuthenticateController(req).hasPermission(req, res, next),
  (req, res, next) => resolveArticlesController(req).update(req, res, next))

router.delete('/:id', (req, res, next) => resolveAuthenticateController(req).authenticateJWT(req, res, next),
  (req, res, next) => resolveAuthenticateController(req).hasPermission(req, res, next),
  (req, res, next) => resolveArticlesController(req).delete(req, res, next))
