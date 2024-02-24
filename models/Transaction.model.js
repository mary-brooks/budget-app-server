const { Schema, model } = require('mongoose');

const transactionSchema = new Schema({
  amount: { type: Number, default: 0 },
  vendor: { type: String, required: [true, 'Vendor is required.'] },
  category: { type: String, default: '' },
  date: { type: Date, default: Date.now },
  budget: { type: mongoose.Schema.Types.ObjectId, ref: 'Budget' },
});

const Transaction = model('Transaction', transactionSchema);

module.exports = Transaction;
