const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User.model');

const router = express.Router();
const saltRounds = 10;

// POST /auth/signup - Creates a new user in the database
router.post('/signup', async (req, res, next) => {
  const { email, password, name } = req.body;

  try {
    // Check if email, password, or name is provided as an empty string
    if (email === '' || password === '' || name === '') {
      return res
        .status(400)
        .json({ message: 'Provide email, password, and name.' });
    }

    // Use regex to validate the email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    if (!emailRegex.test(email)) {
      return res
        .status(400)
        .json({ message: 'Provide a valid email address.' });
    }

    // Use regex to validate the password format
    const passwordRegex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/;
    if (!passwordRegex.test(password)) {
      return res.status(400).json({
        message:
          'Password must have at least 6 characters and contain at least one number, one lowercase and one uppercase letter.',
      });
    }

    // Check if user already exists in the database
    const userExists = await User.findOne({ email });

    // If the user with the same email already exists, send an error response
    if (userExists) {
      return res
        .status(400)
        .json({ message: 'The provided email is already registered' });
    }

    // Encrypt the password
    const salt = bcrypt.genSaltSync(saltRounds);
    const hashedPassword = bcrypt.hashSync(password, salt);

    // create the user
    const newUser = await User.create({
      email,
      name,
      password: hashedPassword,
    });

    // return the created user without sending the hashedPassword
    res
      .status(201)
      .json({ email: newUser.email, name: newUser.name, _id: newUser._id });
  } catch (error) {
    next(error);
  }
});
