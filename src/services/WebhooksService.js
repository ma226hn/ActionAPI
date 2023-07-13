import fetch from 'node-fetch'
import { MongooseServiceBase } from './MongooseServiceBase.js'
import { WebhookRepository } from '../repositories/WebhookRepository.js'

/**
 * Encapsulates a webhook service.
 */
export class WebhooksService extends MongooseServiceBase {
  /**
   * Initializes a new instance.
   *
   * @param {WebhookRepository} [repository=new WebhookRepository()] - A repository instantiated from a class with the same capabilities as WebhookRepository.
   */
  constructor (repository = new WebhookRepository()) {
    super(repository)
  }

  /**
   * Fire the webhook.
   *
   * @param {object} source - info in the trigger event
   */
  async fireWebhook (source) {
    const webhooks = await this.get()
    const payload = {
      event: 'create-Article',
      data: source
    }
    console.log(webhooks)
    webhooks.forEach((webhook) => {
      console.log(webhook.url)
      this.postWebhook(webhook.url, payload)
    }
    )
  }

  /**
   * Post event.
   *
   * @param {string} url - Url to send webhook .
   * @param  {object} payload - Fetch info.
   */
  async postWebhook (url, payload) {
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      })
      console.log(response)
    } catch (error) {
      console.error(`Failed to send webhook to ${url}: ${error}`)
    }
  }
}
