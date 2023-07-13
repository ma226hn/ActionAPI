
import express from 'express'
import { router as articlesRouter } from './articlesRouter.js'
import { router as biddingsRouter } from './biddingsRouter.js'
import { router as accountsRouter } from './usersRouter.js'
import { router as webhooksRouter } from './webhooksRouter.js'

export const router = express.Router()

router.get('/', (req, res) => {
  const location = new URL(
        `${req.protocol}://${req.get('host')}${req.baseUrl}/`)
  res.json({
    message: 'Hooray! Welcome to version 1 of this very simple RESTful API!',
    _links: {
      self: { href: `${location.href}` },
      articles: { href: `${location.href}/articles` },
      users: { href: `${location.href}/users` },
      biddings: { href: `${location.href}/biddings` },
      webhooks: { href: `${location.href}/webhooks` }
    }
  }
  )
})

router.use('/articles', articlesRouter)
router.use('/biddings', biddingsRouter)
router.use('/users', accountsRouter)
router.use('/webhooks', webhooksRouter)
