import jwt from 'jsonwebtoken';

function parseToken(req) {
  const header = req.headers.authorization || '';
  const parts = header.split(' ');
  if (parts.length === 2 && parts[0] === 'Bearer') return parts[1];
  return null;
}

export const authMiddleware = {
  required: (req, res, next) => {
    const token = parseToken(req);
    if (!token) return res.status(401).json({ error: 'Missing token' });
    try {
      req.user = jwt.verify(token, process.env.JWT_SECRET);
      next();
    } catch {
      return res.status(401).json({ error: 'Invalid token' });
    }
  },
  optional: (req, _res, next) => {
    const token = parseToken(req);
    if (token) {
      try { req.user = jwt.verify(token, process.env.JWT_SECRET); } catch {}
    }
    next();
  }
};
