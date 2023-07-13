
import { MongooseServiceBase } from './MongooseServiceBase.js'
import { BiddingRepository } from '../repositories/BiddingRepository.js'

/**
 * Encapsulates a bidding service.
 */
export class BiddingsService extends MongooseServiceBase {
  /**
   * Initializes a new instance.
   *
   * @param {BiddingRepository} [repository=new BiddingRepository()] - A repository instantiated from a class with the same capabilities as BiddingRepository.
   */
  constructor (repository = new BiddingRepository()) {
    super(repository)
  }
}
