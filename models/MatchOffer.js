const mongoose = require('mongoose');

const matchOfferSchema = new mongoose.Schema({
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Customer',
    required: true
  },
  offer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Offer',
    required: true
  },
  matchedAt: {
    type: Date,
    default: Date.now
  },
}, {
  timestamps: true
});

const MatchOffer = mongoose.model('MatchOffer', matchOfferSchema);

module.exports = MatchOffer;
