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

    // Check if the corresponding budget exists for the authenticated user
    const existingBudget = await Budget.exists({
      _id: budgetId,
      user: req.payload._id,
    });
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
      user: req.payload._id,
    });

    // Respond with the newly created transaction
    res.status(201).json(newTransaction);
  } catch (error) {
    // Pass any errors to the error handler
    next(error);
  }
});

// CRUD Read: Get transactions for a given budget and user
router.get('/budgets/:budgetId/transactions', async (req, res, next) => {
  const { budgetId } = req.params;
  const { limit } = req.query;

  try {
    // Check if the provided budgetId is a valid MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(budgetId)) {
      return res.status(400).json({ message: 'Budget id is not valid' });
    }

    // Check if the corresponding budget exists for the authenticated user
    const existingBudget = await Budget.exists({
      _id: budgetId,
      user: req.payload._id,
    });
    if (!existingBudget) {
      return res.status(404).json({ message: 'Budget not found' });
    }

    // Retrieve transactions for a given budget and user from the database
    let transactions;

    if (limit) {
      // If limit is specified, retrieve the specified number of recent transactions
      transactions = await Transaction.find({
        budget: budgetId,
        user: req.payload._id,
      })
        .sort({ date: -1 }) // Sort by date in descending order
        .limit(parseInt(limit, 10)); // Convert limit to an integer
    } else {
      // Otherwise, retrieve all transactions
      transactions = await Transaction.find({
        budget: budgetId,
        user: req.payload._id,
      });
    }

    // Respond with the list of transactions
    res.status(200).json(transactions);
  } catch (error) {
    // Pass any errors to the error handler
    next(error);
  }
});

// CRUD Read: Get single transaction for a given budget and user by ID
router.get(
  '/budgets/:budgetId/transactions/:transactionId',
  async (req, res, next) => {
    const { transactionId } = req.params;

    try {
      // Check if the provided transactionId is a valid MongoDB ObjectId
      if (!mongoose.Types.ObjectId.isValid(transactionId)) {
        return res.status(400).json({ message: 'Transaction ID is not valid' });
      }

      // Find a single transaction by ID for the authenticated user and budget
      const transaction = await Transaction.findOne({
        _id: transactionId,
        budget: req.params.budgetId,
        user: req.payload._id,
      });

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

// CRUD Update: Put to update a single transaction for a given budget and user by ID
router.put(
  '/budgets/:budgetId/transactions/:transactionId',
  async (req, res, next) => {
    const { budgetId, transactionId } = req.params;
    const { amount, vendor, category, date } = req.body;

    try {
      // Check if the provided transactionId is a valid MongoDB ObjectId
      if (!mongoose.Types.ObjectId.isValid(transactionId)) {
        return res.status(400).json({ message: 'Transaction ID is not valid' });
      }

      // Update a single transaction by ID for the authenticated user and budget
      const updatedTransaction = await Transaction.findOneAndUpdate(
        {
          _id: transactionId,
          budget: budgetId,
          user: req.payload._id,
        },
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

/// CRUD Delete: Delete single transaction for a given budget and user
router.delete(
  '/budgets/:budgetId/transactions/:transactionId',
  async (req, res, next) => {
    const { budgetId, transactionId } = req.params;

    try {
      // Check if the provided transactionId is a valid MongoDB ObjectId
      if (!mongoose.Types.ObjectId.isValid(transactionId)) {
        return res.status(400).json({ message: 'Transaction ID is not valid' });
      }

      // Delete single transaction by ID for the authenticated user and budget
      const deletedTransaction = await Transaction.findOneAndDelete({
        _id: transactionId,
        budget: budgetId,
        user: req.payload._id,
      });

      // Check if the transaction exists
      if (!deletedTransaction) {
        return res.status(404).json({ message: 'Transaction not found' });
      }

      // Respond with a success message
      res.status(200).json({ message: 'Transaction deleted successfully' });
    } catch (error) {
      // Pass any errors to the error handler
      next(error);
    }
  }
);

module.exports = router;
