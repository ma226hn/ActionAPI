
import express from 'express'

export const router = express.Router()

/**
 * Resolve biddingsController.
 *
  @param {object} req - Express request object.
 */
const resolveBiddingsController = (req) => req.app.get('container').resolve('BiddingsController')

/**
 * Resolve authenticatController.
 *
  @param {object} req - Express request object.
 */
const resolveAuthenticateController = (req) => req.app.get('container').resolve('AuthenticateController')

router.get('/', (req, res, next) => resolveBiddingsController(req).findAllBiddings(req, res, next))

router.post('/', (req, res, next) => resolveAuthenticateController(req).authenticateJWT(req, res, next),
  (req, res, next) => resolveBiddingsController(req).create(req, res, next))

router.param('id', (req, res, next, id) => resolveBiddingsController(req).loadBidding(req, res, next, id))

router.get('/:id', (req, res, next) => resolveBiddingsController(req).find(req, res, next))
