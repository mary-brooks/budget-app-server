const router = require('express').Router();
const Transaction = require('../models/Transaction.model');
const Budget = require('../models/Budget.model');
const mongoose = require('mongoose');

// CRUD Create: Post new transaction for a given budget
router.post('/budgets/:budgetId/transactions', async (req, res, next) => {
  const { budgetId } = req.params;
  const { amount, vendor, category, date } = req.body;

  try {
    // Check if the provided budgetId is a valid MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(budgetId)) {
      return res.status(400).json({ message: 'Budget id is not valid' });
    }

    // Check if the corresponding budget exists in the database
    const existingBudget = await Budget.exists({ _id: budgetId });
    if (!existingBudget) {
      return res.status(404).json({ message: 'Budget not found' });
    }

    // Create a new transaction for a given budget
    const newTransaction = await Transaction.create({
      amount,
      vendor,
      category,
      date,
      budget: budgetId,
    });

    // Respond with the newly created transaction
    res.status(201).json(newTransaction);
  } catch (error) {
    // Pass any errors to the error handler
    next(error);
  }
});

// CRUD Read: Get all transactions for a given budget
router.get('/budgets/:budgetId/transactions', async (req, res, next) => {
  const { budgetId } = req.params;

  try {
    // Retrieve all transactions for a given budget from the database
    const transactions = await Transaction.find({ budget: budgetId });

    // Respond with the list of transactions
    res.status(200).json(transactions);
  } catch (error) {
    // Pass any errors to the error handler
    next(error);
  }
});

// CRUD Read: Get single transaction for a given budget by ID
router.get(
  '/budgets/:budgetId/transactions/:transactionId',
  async (req, res, next) => {
    const { transactionId } = req.params;

    try {
      // Check if the provided transactionId is a valid MongoDB ObjectId
      if (!mongoose.Types.ObjectId.isValid(transactionId)) {
        return res.status(400).json({ message: 'Transaction ID is not valid' });
      }

      // Find a single transaction by ID
      const transaction = await Transaction.findById(transactionId);

      // Check if the transaction exists
      if (!transaction) {
        return res.status(404).json({ message: 'Transaction not found' });
      }

      // Respond with the found transaction
      res.status(200).json(transaction);
    } catch (error) {
      // Pass any errors to the error handler
      next(error);
    }
  }
);

// CRUD Update: Put to update a single transaction for a given budget by ID
router.put(
  '/budgets/:budgetId/transactions/:transactionId',
  async (req, res, next) => {
    const { transactionId } = req.params;
    const { amount, vendor, category, date } = req.body;

    try {
      // Check if the provided transactionId is a valid MongoDB ObjectId
      if (!mongoose.Types.ObjectId.isValid(transactionId)) {
        return res.status(400).json({ message: 'Transaction ID is not valid' });
      }

      // Update a single transaction by ID
      const updatedTransaction = await Transaction.findByIdAndUpdate(
        transactionId,
        {
          amount,
          vendor,
          category,
          date,
        },
        { new: true }
      );

      // Check if the transaction exists
      if (!updatedTransaction) {
        return res.status(404).json({ message: 'Transaction not found' });
      }

      // Respond with the updated transaction
      res.status(200).json(updatedTransaction);
    } catch (error) {
      // Pass any errors to the error handler
      next(error);
    }
  }
);

// CRUD Delete: Delete single transaction for a given budget
router.delete(
  '/budgets/:budgetId/transactions/:transactionId',
  async (req, res, next) => {
    const { transactionId } = req.params;

    try {
      // Check if the provided transactionId is a valid MongoDB ObjectId
      if (!mongoose.Types.ObjectId.isValid(transactionId)) {
        return res.status(400).json({ message: 'Transaction ID is not valid' });
      }

      // Delete single transaction by ID
      await Transaction.findByIdAndDelete(transactionId);

      // Respond with a success message
      res.status(200).json({ message: 'Transaction deleted successfully' });
    } catch (error) {
      // Pass any errors to the error handler
      next(error);
    }
  }
);

module.exports = router;
