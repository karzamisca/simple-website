const mongoose = require("mongoose");

// Define the Purchase schema
const purchaseSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  purchaseCode: {
    type: String,
    required: true,
  },
  items: [
    {
      productId: {
        type: String,
        required: true,
      },
      title: {
        type: String,
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
      },
      price: {
        type: Number,
        required: true,
      },
    },
  ],
  totalPrice: {
    type: Number,
    required: true,
  },
  purchaseDate: {
    type: Date,
    default: Date.now,
  },
});

// Create the Purchase model
const Purchase = mongoose.model("Purchase", purchaseSchema);

module.exports = Purchase;
