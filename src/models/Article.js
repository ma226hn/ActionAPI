/**
 * Mongoose model Article.
 *
 */

import mongoose from 'mongoose'

// Create a schema.
const schema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    minlength: 1
  },
  description: {
    type: String,
    required: true,
    trim: true,
    minlength: 1
  },
  city: {
    type: String,
    required: true,
    trim: true,
    minlength: 1
  },
  type: {
    type: String,
    required: true,
    trim: true,
    minlength: 1

  },
  ownerId: {
    type: String,
    required: true,
    trim: true,
    minlength: 1
  },

  ownerName: {
    type: String,
    required: true,
    trim: true,
    minlength: 1
  },
  images: [String]
}, {
  timestamps: true,
  toJSON: {
    virtuals: true, // ensure virtual fields are serialized
    /**
     * Performs a transformation of the resulting object to remove sensitive information.
     *
     * @param {object} doc - The mongoose document which is being converted.
     * @param {object} ret - The plain object representation which has been converted.
     */
    transform: function (doc, ret) {
      delete ret.__v
      delete ret._id
    }
  }
})

schema.virtual('id').get(function () {
  return this._id.toHexString()
})

// Create a model using the schema.
export const Article = mongoose.model('Article', schema)
