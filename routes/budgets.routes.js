const router = require('express').Router();
const Budget = require('../models/Budget.model');
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
    const newBudget = await Budget.create({
      name,
      startDate,
      endDate,
      totalIncome,
      savingsGoal,
      categoryAllocation,
    });

    res.status(201).json(newBudget);
  } catch (error) {
    next(error);
  }
});

// CRUD Read: Get all budgets
router.get('/budgets', async (req, res, next) => {
  try {
    const budgets = await Budget.find({});
    res.status(200).json(budgets);
  } catch (error) {
    next(error);
  }
});

// CRUD Read: Get a single budget
router.get('/budgets/:id', async (req, res, next) => {
  const { id } = req.params;

  try {
    //check if id is a valid value in the DB
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Id is not valid' });
    }

    const budget = await Budget.findById(id);

    // check if there is a budget to retrieve
    if (!budget) {
      return res.status(404).json({ message: 'No budget found' });
    }

    res.status(200).json(budget);
  } catch (error) {
    console.log('Error retrieving budget:', error);
    next(error);
  }
});

module.exports = router;
