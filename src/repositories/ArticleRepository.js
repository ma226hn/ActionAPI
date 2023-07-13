
import { MongooseRepositoryBase } from './MongooseRepositoryBase.js'
import { Article } from '../models/Article.js'

/**
 * Encapsulates a article repository.
 */
export class ArticleRepository extends MongooseRepositoryBase {
  /**
   * Initializes a new instance.
   *
   * @param {Article} [model=Article] - A class with the same capabilities as TaskModel.
   */
  constructor (model = Article) {
    super(model)
  }
}
