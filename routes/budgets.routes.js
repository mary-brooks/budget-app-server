const router = require('express').Router();
const Budget = require('../models/Budget.model');
const Transaction = require('../models/Transaction.model');
const mongoose = require('mongoose');

// CRUD Create: Post new budget
router.post('/budgets', async (req, res, next) => {
  const {
    name,
    startDate,
    endDate,
    totalIncome,
    savingsGoal,
    categoryAllocation,
  } = req.body;

  try {
    // Create a new budget
    const newBudget = await Budget.create({
      name,
      startDate,
      endDate,
      totalIncome,
      savingsGoal,
      categoryAllocation,
    });

    // Respond with the newly created budget
    res.status(201).json(newBudget);
  } catch (error) {
    // Pass any errors to the error handler
    next(error);
  }
});

// CRUD Read: Get all budgets
router.get('/budgets', async (req, res, next) => {
  try {
    // Retrieve all budgets from the database
    const budgets = await Budget.find({});

    // Respond with the list of budgets
    res.status(200).json(budgets);
  } catch (error) {
    // Pass any errors to the error handler
    next(error);
  }
});

// CRUD Read: Get a single budget by ID
router.get('/budgets/:budgetId', async (req, res, next) => {
  const { budgetId } = req.params;

  try {
    // Check if the provided budgetId is a valid MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(budgetId)) {
      return res.status(400).json({ message: 'Id is not valid' });
    }

    // Retrieve a single budget by ID
    const budget = await Budget.findById(budgetId);

    // Check if there is a budget to retrieve
    if (!budget) {
      return res.status(404).json({ message: 'No budget found' });
    }

    // Respond with the retrieved budget
    res.status(200).json(budget);
  } catch (error) {
    // Pass any errors to the error handler
    next(error);
  }
});

// CRUD Update: Put to update a single budget by ID
router.put('/budgets/:budgetId', async (req, res, next) => {
  const { budgetId } = req.params;
  const {
    name,
    startDate,
    endDate,
    totalIncome,
    savingsGoal,
    categoryAllocation,
  } = req.body;

  try {
    // Check if the provided budgetId is a valid MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(budgetId)) {
      return res.status(400).json({ message: 'Id is not valid' });
    }

    // Update a single budget by ID
    const updatedBudget = await Budget.findByIdAndUpdate(
      budgetId,
      {
        name,
        startDate,
        endDate,
        totalIncome,
        savingsGoal,
        categoryAllocation,
      },
      { new: true }
    );

    // Check if the budget was found and updated
    if (!updatedBudget) {
      return res.status(404).json({ message: 'No budget found' });
    }

    // Respond with the updated budget
    res.status(200).json(updatedBudget);
  } catch (error) {
    // Pass any errors to the error handler
    next(error);
  }
});

// CRUD Delete: Delete a single budget by ID & related transactions
router.delete('/budgets/:budgetId', async (req, res, next) => {
  const { budgetId } = req.params;

  try {
    // Check if the provided budgetId is a valid MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(budgetId)) {
      return res.status(400).json({ message: 'Id is not valid' });
    }

    // Delete a single budget by ID
    await Budget.findByIdAndDelete(budgetId);

    // Delete all transactions related to the deleted budget
    await Transaction.deleteMany({ budget: budgetId });

    // Respond with a success message
    res.status(200).json({ message: 'Budget deleted successfully' });
  } catch (error) {
    // Pass any errors to the error handler
    next(error);
  }
});

module.exports = router;
