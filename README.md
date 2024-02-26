# Budget App Server

## Routes

### Budget Routes

| Method | Route                  | Description                  |
| ------ | ---------------------- | ---------------------------- |
| GET    | /api/budgets           | Returns all budgets          |
| GET    | /api/budgets/:budgetId | Returns the specified budget |
| POST   | /api/budgets           | Creates a new budget         |
| PUT    | /api/budgets/:budgetId | Edits the specified budget   |
| DELETE | /api/budgets/:budgetId | Deletes the specified budget |

### Transaction Routes

| Method | Route                                              | Description                                                 |
| ------ | -------------------------------------------------- | ----------------------------------------------------------- |
| GET    | /api/budgets/:budgetId/transactions                | Returns all transactions associated with a specific budget  |
| GET    | /api/budgets/:budgetId/transactions/:transactionId | Returns the specified transaction                           |
| POST   | /api/:budgetId/transactions                        | Creates a new transaction associated with a specific budget |
| PUT    | /api/budgets/:budgetId/transactions/:transactionId | Edits the specified transaction                             |
| DELETE | /api/budgets/:budgetId/transactions/transactionId  | Deletes the specified transaction                           |

## Models

### Budget Model

```js
{
    name: String,
    startDate: Date,
    endDate: Date,
    totalIncome: Number,
    savingsGoal: Number,
    categoryAllocation: [{name: String, amount: number}]
}

```

### Transaction Model

```js
{
    amount: Number,
    vendor: String,
    category: String,
    date: Date,
    budget: {type: Schema.Type.ObjectId, ref: 'Budget'}
}

```

### User Model

```js
{
  name: String
  email: String,
  password: String,
}
```
