# Budget App Server

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
