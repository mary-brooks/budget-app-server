const router = require('express').Router();
const Transaction = require('../models/Transaction.model');

// CRUD Create: Post new transaction
router.post('/transactions', async (req, res, next) => {
  const { amount, vendor, category, date, budgetId } = req.body;

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

module.exports = router;
