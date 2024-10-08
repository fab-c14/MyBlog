import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '1h' });
};

// Register user
export const register = async (req, res) => {
  const {  email, password } = req.body;

  try {
    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const user = await User.create({ email, password });
    // const token = generateToken(user._id);

    res.status(201).json({
      _id: user._id,
      email: user.email,
      // token,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// Login user
export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // const token = generateToken(user._id);
    res.json({ _id: user._id, email: user.email, 
      // token
     });
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: 'Server Error' });
  }
};
