const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const tagSchema = new Schema(
  {
    slug: {
      type: String,
      unique: true,
      index: true,
    },
    name: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

const Tag = mongoose.model('Tag', tagSchema);

module.exports = Tag;
