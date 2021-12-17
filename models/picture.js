const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const pictureSchema = new Schema({
  URI: String,
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  house: {
    type: Schema.Types.ObjectId,
    ref: 'House'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Picture', pictureSchema);