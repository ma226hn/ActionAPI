
import { MongooseRepositoryBase } from './MongooseRepositoryBase.js'
import { Webhooks } from '../models/Webhooks.js'

/**
 *
 */
export class WebhookRepository extends MongooseRepositoryBase {
  /**
   * Initializes a new instance.
   *
   * @param {Webhooks} [model=Webhooks] - A class with the same capabilities as Webhook.
   */
  constructor (model = Webhooks) {
    super(model)
  }
}
