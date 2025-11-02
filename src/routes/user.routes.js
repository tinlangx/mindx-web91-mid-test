import { Router } from 'express';
import crypto from 'node:crypto';
import User from '../models/User.js';

const router = Router();

/**
 * 1) Đăng ký
 * POST /users/register
 */
router.post('/register', async (req, res) => {
  const { userName, email, password } = req.body;
  if (!userName || !email || !password) {
    const e = new Error('userName, email, password là bắt buộc');
    e.statusCode = 400;
    throw e;
  }

  const existed = await User.findOne({ email });
  if (existed) {
    const e = new Error('Email đã tồn tại');
    e.statusCode = 400;
    throw e;
  }

  const user = await User.create({ userName, email, password });
  res.status(201).json(user);
});

/**
 * 2) Đăng nhập → sinh apiKey
 * POST /users/login
 */
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    const e = new Error('email & password là bắt buộc');
    e.statusCode = 400;
    throw e;
  }

  const user = await User.findOne({ email });
  if (!user || !(await user.comparePassword(password))) {
    const e = new Error('Email hoặc mật khẩu không đúng');
    e.statusCode = 400;
    throw e;
  }

  const random = crypto.randomBytes(16).toString('hex');
  const apiKey = `mern-$${user._id.toString()}$${user.email}$${random}`;
  user.apiKey = apiKey;
  await user.save();

  res.json({ apiKey, user: user.toJSON() });
});

export default router;
