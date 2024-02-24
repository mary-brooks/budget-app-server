const { Schema, model } = require('mongoose');

const budgetSchema = new Schema({
  name: { type: String, required: [true, 'Budget name is required.'] },
  startDate: { type: Date, default: Date.now },
  endDate: Date,
  totalIncome: { type: Number, min: 0, default: 0 },
  savingsGoal: { type: Number, min: 0, default: 0 },
  categoryAllocation: {
    type: [
      {
        name: String,
        amount: Number,
      },
    ],
    default: [],
  },
});

const Budget = model('Budget', budgetSchema);

module.exports = Budget;
