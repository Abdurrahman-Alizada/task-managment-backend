import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
interface userInput {
	email: string;
	role:string;
	userType:string
}
const generateToken = ({ email, role,userType }: userInput) => {
	const token = jwt.sign(
		{
			email: email,
			role:role,
			userType:userType
		},
		`${process.env.SECRETKEY}`,
		{ expiresIn: '30d' } // Set the token expiration time as needed
	);

	return token;
};
export default generateToken;
