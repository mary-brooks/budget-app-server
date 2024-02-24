const router = require('express').Router();
const Budget = require('../models/Budget.model');
const mongoose = require('mongoose');

// CRUD Create: New budget
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

module.exports = router;
