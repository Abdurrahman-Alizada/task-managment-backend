import { Request, Response, NextFunction } from 'express';

interface CustomRequest extends Request {
  user?: any;
}

export const isAdmin = (req: CustomRequest, res: Response, next: NextFunction) => {
  if (req.user.role !== 'Admin') {
    return res.status(403).json({ message: 'Admin access required' });
  }
  next();
};

export const isManagerOrAdmin = (req: CustomRequest, res: Response, next: NextFunction) => {
  if (!['Admin', 'Manager'].includes(req.user.role)) {
    return res.status(403).json({ message: 'Manager or admin access required' });
  }
  next();
};