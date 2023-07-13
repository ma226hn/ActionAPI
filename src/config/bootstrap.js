
import { IoCContainer } from '../util/IoCContainer.js'
import { Article } from '../models/Article.js'
import { Bidding } from '../models/Bidding.js'
import { User } from '../models/User.js'
import { Webhooks } from '../models/Webhooks.js'
import { ArticleRepository } from '../repositories/ArticleRepository.js'
import { BiddingRepository } from '../repositories/BiddingRepository.js'
import { UserRepository } from '../repositories/UserRepository.js'
import { WebhookRepository } from '../repositories/WebhookRepository.js'

import { ArticlesService } from '../services/ArticlesService.js'
import { BiddingsService } from '../services/BiddingsService.js'
import { UsersService } from '../services/UsersService.js'
import { WebhooksService } from '../services/WebhooksService.js'

import { BiddingsController } from '../controllers/BiddingsController.js'
import { AuthenticateController } from '../controllers/AuthenticateController.js'
import { ArticlesController } from '../controllers/ArticlesController.js'
import { UsersController } from '../controllers/UsersController.js'
import { WebhooksController } from '../controllers/WebhooksController.js'

const iocContainer = new IoCContainer()

iocContainer.register('ConnectionString', process.env.DB_CONNECTION_STRING)

iocContainer.register('PRIVATE_KEY', process.env.PRIVATE_KEY)

iocContainer.register('PUBLIC_KEY', process.env.PUBLIC_KEY)

iocContainer.register('ACCESS_TOKEN_LIFE', process.env.ACCESS_TOKEN_LIFE)

iocContainer.register('AuthenticateController', AuthenticateController, {
  dependencies: [
  ]
})

iocContainer.register('ArticleType', Article, { type: true })

iocContainer.register('ArticleRepositorySingleton', ArticleRepository, {
  dependencies: [
    'ArticleType'
  ],
  singleton: true
})

iocContainer.register('ArticlesServiceSingleton', ArticlesService, {
  dependencies: [
    'ArticleRepositorySingleton'
  ],
  singleton: true
})

iocContainer.register('ArticlesController', ArticlesController, {
  dependencies: [
    'ArticlesServiceSingleton',
    'WebhooksServiceSingleton'
  ]
})

//* ********** */
iocContainer.register('BiddingType', Bidding, { type: true })

iocContainer.register('BiddingRepositorySingleton', BiddingRepository, {
  dependencies: [
    'BiddingType'
  ],
  singleton: true
})

iocContainer.register('BiddingsServiceSingleton', BiddingsService, {
  dependencies: [
    'BiddingRepositorySingleton'
  ],
  singleton: true
})

iocContainer.register('BiddingsController', BiddingsController, {
  dependencies: [
    'BiddingsServiceSingleton'
  ]
})

//* ************** */
iocContainer.register('WebhookType', Webhooks, { type: true })

iocContainer.register('WebhookRepositorySingleton', WebhookRepository, {
  dependencies: [
    'WebhookType'
  ],
  singleton: true
})

iocContainer.register('WebhooksServiceSingleton', WebhooksService, {
  dependencies: [
    'WebhookRepositorySingleton'
  ],
  singleton: true
})

iocContainer.register('WebhooksController', WebhooksController, {
  dependencies: [
    'WebhooksServiceSingleton'
  ]
})

iocContainer.register('UserType', User, { type: true })

iocContainer.register('UsersRepositorySingleton', UserRepository, {
  dependencies: [
    'UserType'
  ],
  singleton: true
})

iocContainer.register('UsersServiceSingleton', UsersService, {
  dependencies: [
    'UsersRepositorySingleton'
  ],
  singleton: true
})

iocContainer.register('UsersController', UsersController, {
  dependencies: [
    'UsersServiceSingleton'
  ]
})

export const container = Object.freeze(iocContainer)
