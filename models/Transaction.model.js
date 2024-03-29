const { Schema, model } = require('mongoose');

const transactionSchema = new Schema({
  amount: { type: Number, default: 0 },
  convertedAmount: {
    type: Number,
    default: function () {
      return this.amount;
    },
  },
  currency: { type: String, default: 'EUR' },
  vendor: { type: String, required: [true, 'Vendor is required.'] },
  category: { type: String, default: '' },
  date: { type: Date, default: Date.now },
  budget: { type: Schema.Types.ObjectId, ref: 'Budget' },
  user: { type: Schema.Types.ObjectId, ref: 'User' },
});

const Transaction = model('Transaction', transactionSchema);

module.exports = Transaction;
