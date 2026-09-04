// =========================================================
// Protects admin routes — checks for a valid JWT in the
// "Authorization: Bearer <token>" header
// =========================================================
const jwt = require('jsonwebtoken');
 
const protectAdmin = (req, res, next) => {
  const authHeader = req.headers.authorization;
 
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, message: 'Not authorized. Please log in.' });
  }
 
  const token = authHeader.split(' ')[1];
 
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.admin = decoded; // available to the next controller if needed
    next();
  } catch (error) {
    return res.status(401).json({ success: false, message: 'Session expired. Please log in again.' });
  }
};
 
module.exports = protectAdmin;
 