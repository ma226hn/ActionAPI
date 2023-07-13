
import express from 'express'

export const router = express.Router()

/**
 * Resolv userController
 *
  @param {object} req - Express request object.
 */
const resolveUsersController = (req) => req.app.get('container').resolve('UsersController')

router.post('/login', (req, res, next) => resolveUsersController(req).login(req, res, next))

// Register
router.post('/register', (req, res, next) => resolveUsersController(req).register(req, res, next))
