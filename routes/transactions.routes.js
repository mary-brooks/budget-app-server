const router = require('express').Router();
const Transaction = require('../models/Transaction.model');

// CRUD Create: Post new transaction for a given budget
router.post('/budgets/:budgetId/transactions', async (req, res, next) => {
  const { budgetId } = req.params;
  const { amount, vendor, category, date } = req.body;

  try {
    const newTransaction = await Transaction.create({
      amount,
      vendor,
      category,
      date,
      budget: budgetId,
    });

    res.status(201).json(newTransaction);
  } catch (error) {
    next(error);
  }
});

// CRUD Read: Get all transactions for a given budget
router.get('/budgets/:budgetId/transactions', async (req, res, next) => {
  const { budgetId } = req.params;

  try {
    const transactions = await Transaction.find({ budget: budgetId });
    res.status(200).json(transactions);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
