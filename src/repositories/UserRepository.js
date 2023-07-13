
import { MongooseRepositoryBase } from './MongooseRepositoryBase.js'
import { User } from '../models/User.js'

/**
 * Encapsulates a user repository.
 */
export class UserRepository extends MongooseRepositoryBase {
  /**
   * Initializes a new instance.
   *
   * @param {User} [model=User] - A class with the same capabilities as User.
   */
  constructor (model = User) {
    super(model)
  }
}
