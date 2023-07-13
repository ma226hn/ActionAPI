
import { MongooseRepositoryBase } from './MongooseRepositoryBase.js'
import { Bidding } from '../models/Bidding.js'

/**
 * Encapsulates bidding repository.
 */
export class BiddingRepository extends MongooseRepositoryBase {
  /**
   * Initializes a new instance.
   *
   * @param {Bidding} [model=Bidding] - A class with the same capabilities as TaskModel.
   */
  constructor (model = Bidding) {
    super(model)
  }
}
