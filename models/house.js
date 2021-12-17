const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const commentSchema = new Schema({
  content: {
    type: String,
    required: true
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  userName: String
}, {
  timestamps: true
});

const houseSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  latLon: String,
  constructionYear: {
    type: Number,
    default: '1800'
  },
  archStyle: {
    type: String,
    enum: ['Colonial', 'Federal', 'Other']
  },
  featuredPicture: String,
  description: String,
  isFeatured: {
    type: Boolean,
    default: false
  },
  comments: [commentSchema],
  pictures: [{
    type: Schema.Types.ObjectId,
    ref: 'Picture'
  }]
}, {
  timestamps: true,
});

module.exports = mongoose.model("House", houseSchema);
