import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export function authGuard(req, res, next) {
  const authHeader = req.headers.authorization;
  const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : null;

  if (!token) {
    return res.status(401).json({ success: false, message: 'Authentication required' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    User.findById(decoded.userId)
      .select('-password')
      .then((user) => {
        if (!user) {
          return res.status(401).json({ success: false, message: 'User not found' });
        }
        req.user = user;
        next();
      })
      .catch(() => res.status(401).json({ success: false, message: 'Authentication failed' }));
  } catch (err) {
    return res.status(401).json({ success: false, message: 'Invalid or expired token' });
  }
}
