import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';

const verifyToken = (req: Request, res: Response, next: NextFunction) => {
	const token = req.headers.authorization?.split(' ')[1];

	if (!token) {
		return res.status(401).json({ message: 'No token provided' });
	}

	jwt.verify(
		token,
		`${process.env.SECRETKEY}`,
		(err: jwt.VerifyErrors | null) => {
			if (err) {
				return res.status(401).json({ message: 'Token expired or invalid' });
			}
			// If token is valid, you can access decoded data here
			// For example: req.user = decoded;
			next();
		}
	);
};

export default verifyToken;
