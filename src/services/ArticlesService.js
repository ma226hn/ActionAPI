
import { MongooseServiceBase } from './MongooseServiceBase.js'
import { ArticleRepository } from '../repositories/ArticleRepository.js'

/**
 * Encapsulates a Article service.
 */
export class ArticlesService extends MongooseServiceBase {
  /**
   * Initializes a new instance.
   *
   * @param {ArticleRepository} [repository=new ArticleRepository()] - A repository instantiated from a class with the same capabilities as ArticleRepository.
   */
  constructor (repository = new ArticleRepository()) {
    super(repository)
  }
}
