const mongoose = require('mongoose');

const LiqudityProviderSchema = new mongoose.Schema(
  { 
    symbol: {
      type: String,
      required: true
    },
    askAmount: {
      type: Number,
      required: true
    },
    bidAmount: {
      type: Number,
      required: true
    },
    askDifference: {
      type: Number,
      required: true
    },
    askPrice: {
      type: Number,
      required: true
    },
    askOrderId: {
      type: String,
      required: true
    },
    bidDifference: {
      type: Number,
      required: true
    },
    bidPrice: {
      type: Number,
      required: true
    },
    bidOrderId: {
      type: String,
      required: true
    },
    startPrice:{
      type: Number,
      required: true
    },
    status:{
      type:Boolean,
      default:true
    },
    err:{
      type: String,
      default: null
    }
  },
  {
    timestamps: true,
  }
);

const LiqudityProvider = new mongoose.model('LiqudityProviders', LiqudityProviderSchema);

module.exports = LiqudityProvider;
