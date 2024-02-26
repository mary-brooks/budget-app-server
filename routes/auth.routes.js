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

    // If a user with the same email already exists, send an error response
    if (userExists) {
      return res
        .status(400)
        .json({ message: 'The provided email is already registered.' });
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

// POST /auth/login - Verifies email and password and returns a JWT
router.post('/auth/login', async (req, res, next) => {
  const { email, password } = req.body;

  try {
    // Check if email or password is provided as an empty string
    if (email === '' || password === '') {
      return res.status(400).json({ message: 'Provide email and password.' });
    }

    // Check if user already exists in the database
    const user = await User.findOne({ email });

    // If the user is not found, send an error response
    if (!user) {
      return res
        .status(401)
        .json({ message: 'Provided email is not registered.' });
    }

    // Compare the provided password with the one saved in the database
    const isPasswordCorrect = bcrypt.compareSync(password, user.password);

    // If the password is correct, create a payload for the JWT with the user info
    if (isPasswordCorrect) {
      // DO NOT SEND THE HASHED PASSWORD
      const payload = { _id: user._id, email: user.email, name: user.name };

      // Create and send the JWT
      const authToken = jwt.sign(payload, process.env.TOKEN_SECRET, {
        algorithm: 'HS256', // algorithm we want to encrypt the token with
        expiresIn: '6h', // time of validity of the JWT
      });

      // Send the token as the response
      res.status(200).json({ authToken });
    } else {
      res.status(401).json({ message: 'Unable to authenticate the user.' });
    }
  } catch (error) {
    next(error);
  }
});
