import { UNAUTHORIZED } from '../constants/httpStatus.js';
import authMid from './auth.mid.js';

const adminMid = (req, res, next) => {
  if (!req.user?.isAdmin) { // Added optional chaining
    return res.status(UNAUTHORIZED).send('Admin access denied!'); // Added error message
  }
  next();
};

export default [authMid, adminMid];
