
import express from 'express'

export const router = express.Router()

/**
 * Resolve .
 *
  @param {object} req - Express request object.
 */
const resolveWebhooksController = (req) => req.app.get('container').resolve('WebhooksController')

/**
 * Resolve.
 *
 @param {object} req - Express request object.
 */
const resolveAuthenticateController = (req) => req.app.get('container').resolve('AuthenticateController')

router.param('id', (req, res, next, id) => resolveWebhooksController(req).loadWebhook(req, res, next, id))

router.get('/', (req, res, next) => resolveWebhooksController(req).findAll(req, res, next))

router.post('/', (req, res, next) => resolveAuthenticateController(req).authenticateJWT(req, res, next), (req, res, next) => resolveWebhooksController(req).create(req, res, next))

router.delete('/:id', (req, res, next) => resolveAuthenticateController(req).authenticateJWT(req, res, next),
  (req, res, next) => resolveAuthenticateController(req).hasPermissionOwnerWebhook(req, res, next), (req, res, next) => resolveWebhooksController(req).delete(req, res, next))
