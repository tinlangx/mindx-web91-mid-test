import User from '../models/User.js';

/**
 * Xác thực dựa trên query ?apiKey=...
 * - apiKey phải khớp với apiKey đang lưu trong DB
 * - Hợp lệ -> req.user = user
 */
export default async function requireApiKey(req, res, next) {
  const apiKey = req.query.apiKey;
  if (!apiKey) return res.status(401).json({ message: 'Missing apiKey' });
  if (!apiKey.startsWith('mern-'))
    return res.status(401).json({ message: 'Invalid apiKey format' });

  const user = await User.findOne({ apiKey });
  if (!user) return res.status(401).json({ message: 'apiKey not authorized' });

  req.user = user;
  next();
}
