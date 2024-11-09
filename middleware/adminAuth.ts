import { Request, Response, NextFunction } from 'express';
import jwt, { Secret } from 'jsonwebtoken';
import { UserInterface } from '../interfaces/UserInterfaces';

declare global {
  namespace Express {
    interface Request {
      user?: UserInterface; 
    }
  }
}

const isAdmin: (req: Request, res: Response, next: NextFunction) => void = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];

    // Verify the token
    jwt.verify(token, `${process.env.SECRETKEY}`, (err, decodedToken) => {
      if (err) {
        return res.status(401).json({ message: 'Unauthorized' });
      } else {
        const user = decodedToken as UserInterface; 
        if (user.role === 'admin') {
          req.user = user; 
          next();
        } else {
          return res.status(403).json({ message: 'Forbidden' });
        }
      }
    });
  } else {
    return res.status(401).json({ message: 'Unauthorized' });
  }
};

export default isAdmin;
