
import { MongooseServiceBase } from './MongooseServiceBase.js'
import { UserRepository } from '../repositories/UserRepository.js'

/**
 * Encapsulates a user service.
 */
export class UsersService extends MongooseServiceBase {
  /**
   * Initializes a new instance.
   *
   * @param {UserRepository} [repository=new UserRepository()] - A repository instantiated from a class with the same capabilities as UserRepository.
   */
  constructor (repository = new UserRepository()) {
    super(repository)
  }

  /**
   * Authenticate.
   *
   * @param {object} userCredential - User info.
   */
  async authenticate (userCredential) {
    return this._repository.authenticate(userCredential)
  }

  /**
   * Insert new document to the user schema.
   *
   * @param {object} data -New user info.
   */
  async save (data) {
    return this._repository.save(data)
  }
}
