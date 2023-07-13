import { User } from '../models/User.js'
import { Article } from '../models/Article.js'
import { Bidding } from '../models/Bidding.js'

/**
 * Insert dat to the db.
 */
export async function insertData () {
  const numUser = await User.find().exec()

  if (numUser.length === 0) {
    const user1 = new User({
      username: 'manar',
      password: '123456789m',
      firstName: 'Manar',
      lastName: 'Alibrahim',
      email: 'user1@gmail.com'
    })
    user1.save()

    const user2 = new User({
      username: 'testUser2',
      password: '123456789s',
      firstName: 'Sara',
      lastName: 'Alibrahim',
      email: 'user2@gmail.com'
    })
    user2.save()

    const article1 = new Article(Article.create({
      title: 'picture',
      description: 'the famous artist Shekspair ',
      city: 'Karlstad',
      type: 'artwork',
      ownerId: user1._id,
      ownerName: user1.username,
      images: []
    }))

    Article.create({
      title: 'blue car',
      description: ' old car and antique  ',
      city: 'karlstad',
      type: 'vehicle',
      ownerId: user2._id,
      ownerName: user1.username,
      images: []
    })

    Article.create({
      title: 'old car',
      description: 'green car and beatiful  ',
      city: 'örebro',
      type: 'vehicle',
      ownerId: user1._id,
      ownerName: user1.username,
      images: []
    })

    Article.create({
      title: 'Volvo car',
      description: 'very old car from old model  ',
      city: 'karlstad',
      type: 'vehicle',
      ownerId: user1._id,
      ownerName: user1.username,
      images: []
    })

    Article.create({
      title: 'Nissan car',
      description: 'Nissan old car  ',
      city: 'örebro',
      type: 'vehicle',
      ownerId: user1._id,
      ownerName: user1.username,
      images: []
    })

    Article.create({
      title: 'skania car',
      description: 'very old car  ',
      city: 'kiruna',
      type: 'vehicle',
      ownerId: user1._id,
      ownerName: user1.username,
      images: []
    })

    Article.create({
      title: 'painting',
      description: 'old and pretty art ',
      city: 'Stockholm',
      type: 'artwork',
      ownerId: user1._id,
      ownerName: user1.username,
      images: []
    })

    const article2 = new Article(Article.create({
      title: 'table',
      description: 'old and  antique table ',
      city: 'Stockholm',
      type: 'artwork',
      ownerId: user2._id,
      ownerName: user2.username,
      images: []
    }))

    Article.create({
      title: 'motorcycle',
      description: 'new and unique model ',
      city: 'Stockholm',
      type: 'vehicle',
      ownerId: user1._id,
      ownerName: user1.username,
      images: []
    })

    Article.create({
      title: 'black car',
      description: 'new and unique model ',
      city: 'Stockholm',
      type: 'vehicle',
      ownerId: user1._id,
      ownerName: user1.username,
      images: []
    })

    Article.create({
      title: 'green car',
      description: 'new and unique model ',
      city: 'Stockholm',
      type: 'vehicle',
      ownerId: user1._id,
      ownerName: user1.username,
      images: []
    })
    Article.create({
      title: 'red car',
      description: 'new and unique model ',
      city: 'karlstad',
      type: 'vehicle',
      ownerId: user1._id,
      ownerName: user1.username,
      images: []
    })

    for (let i = 0; i < 130; i++) {
      Bidding.create({
        price: 120 + i * 10,
        bidderId: user1._id,
        bidderName: user1.username,
        articleId: article1._id
      })
      Bidding.create({
        price: 130 + i * 10,
        bidderId: user2._id,
        bidderName: user2.username,
        articleId: article1._id

      })
      Bidding.create({
        price: 40 + i * 10,
        bidderId: user1._id,
        bidderName: user1.username,
        articleId: article2._id
      })
      Bidding.create({
        price: 50 + i * 10,
        bidderId: user2._id,
        bidderName: user2.username,
        articleId: article2._id
      })
    }
  }
}
