const mongoose = require('mongoose');

const CategorySchema = new mongoose.Schema({
  categoryTitle: {
    type: String,
    required: [true, 'Provide a category title'],
    trim: true,
  },
  // posts: [
  //   {
  //     type: mongoose.Schema.Types.ObjectId,
  //     ref: 'Post',
  //   },
  // ],
});

CategorySchema.virtual('posts', {
  ref: 'Post',
  foreignField: 'categories',
  localField: '_id',
});

module.exports = mongoose.model('Category', CategorySchema);
